import prisma from "@/modules/prismaClient";

export default async function handler(req, res) {
    try {
      const data = req.body;
      await prisma.recordedTimeBox.create({
        data: data,
      });
      res.status(200).json({ message: 'Recorded TimeBox created successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      await prisma.$disconnect();
    }
  }