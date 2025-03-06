import prisma from "@/modules/prismaClient";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = req.body;
    await prisma.recordedTimeBox.create({
      data: data,
    });
    res.status(200).json({ message: 'Recorded TimeBox created successfully' });
  } catch (error) {
    console.log(error, error.message);
    res.status(500).json({ error: error.message });
  } finally {
    await prisma.$disconnect();
  }
}