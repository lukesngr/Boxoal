import prisma from "@/modules/prismaClient";

export default async function handler(req, res) {
    try {
        const data = req.body;
        await prisma.goal.create({
            data: data
        })
        res.status(200).json({ message: 'Created goal successfully' });
      } catch (error) {
        res.status(500).json({ error: error.message });
      } finally {
        await prisma.$disconnect();
      }
}