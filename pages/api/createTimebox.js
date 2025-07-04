import prisma from "@/modules/prismaClient";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = req.body;
    await prisma.timeBox.create({
      data: data,
    });
    res.status(200).json({ message: 'TimeBox created successfully' });
  } catch (error) {
    res.status(500).json({ error: error });
    console.log(error);
  } finally {
    await prisma.$disconnect();
  }
}