import prisma from "@/modules/prismaClient";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = req.body;

    const recordedTimeBoxes = await prisma.timeBox.findUnique({
      where: { id: data.id, recordedTimeBoxes: { some: {} } },
      select: { recordedTimeBoxes: { select: { id: true } } }
    });

    if (recordedTimeBoxes && recordedTimeBoxes.recordedTimeBoxes.length > 0) {
      for (const recordedTimeBox of recordedTimeBoxes.recordedTimeBoxes) {
        await prisma.recordedTimeBox.delete({
          where: {
            id: recordedTimeBox.id
          }
        });
      }
    }

    res.status(200).json({ message: 'Recording cleared successfully' });
  } catch (error) {
    console.error('Error clearing recording:', error);

    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await prisma.$disconnect();
  }
}