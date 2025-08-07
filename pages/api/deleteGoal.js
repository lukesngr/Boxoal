import prisma from "@/modules/prismaClient";
import * as Sentry from "@sentry/nextjs";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = req.body;

    await prisma.goal.delete({
      where: {
        id: data.id
      },
      include: {
        timeboxes: true,
      },
    });

    await prisma.loggingOfMetric.deleteMany({
      where: {
        goalId: data.id
      }
    });

    let timeboxes = await prisma.timeBox.findMany({
      where: {
        goalId: data.id
      }
    });

    for (let timebox of timeboxes) {
      await prisma.timeBox.delete({
        where: {
          id: timebox.id
        }
      });

      await prisma.recordedTimeBox.deleteMany({
        where: {
          timeBoxId: timebox.id
        }
      });
    }

    await prisma.

    res.status(200).json({ message: 'Goal deleted successfully' });
  } catch (error) {
    Sentry.captureException(error);

    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await prisma.$disconnect();
  }
}