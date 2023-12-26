import prisma from "@/modules/prismaClient";

export default async function handler(req, res) {
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
      console.error('Error creating schedule:', error);
  
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      await prisma.$disconnect();
    }
  }