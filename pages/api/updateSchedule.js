import prisma from "@/modules/prismaClient";

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = req.body;
    await prisma.schedule.update({
      where: {
        id: data.id,
        userUUID: data.userUUID
      },
      data: data,
    });

    res.status(200).json({ message: 'Schedule updated successfully' });
  } catch (error) {
    console.error('Error updating schedule:', error);

    res.status(500).json({ error: error });
  } finally {
    await prisma.$disconnect();
  }
}