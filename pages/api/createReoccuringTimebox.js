import prisma from "@/modules/prismaClient";

export default async function handler(req, res) {
    try {
      const data = req.body;
      await prisma.reoccuringTimeBox.create({
        data: data,
      });
      res.status(200).json({ message: 'Reoccuring TimeBox created successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
      console.log(error);
    } finally {
      await prisma.$disconnect();
    }
  }