import prisma from "@/modules/prismaClient";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = req.body;

    await prisma.schedule.delete({
      where: {
        id: data.id
      },
      include: {
        timeboxes: true,
        recordedTimeboxes: true,
        goals: true
      },
    });

    res.status(200).json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    console.error('Error deleting schedule:', error);

    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await prisma.$disconnect();
  }
}