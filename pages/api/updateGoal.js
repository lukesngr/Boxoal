import prisma from "@/modules/prismaClient";

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = req.body;
    await prisma.goal.update({
      where: {
        objectUUID: data.objectUUID,
      },
      data: data,
    });
    res.status(200).json({ message: 'Updated goal successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
    console.log(error);
  } finally {
    await prisma.$disconnect();
  }
}