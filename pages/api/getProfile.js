import prisma from "@/modules/prismaClient";

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = req.query;
    const points = await prisma.profile.findUnique({
      where: {
        userUUID: data.userUUID,
      }
    });
    res.json(points);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await prisma.$disconnect();
  }
}