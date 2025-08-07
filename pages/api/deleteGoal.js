import prisma from "@/modules/prismaClient";
import * as Sentry from "@sentry/nextjs";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = req.body;

    await prisma.loggingOfMetric.deleteMany({
      where: {
        goalID: data.id
      }
    });

    await prisma.goal.delete({
      where: {
        id: data.id
      },
      include: {
        timeboxes: {
          include: {
            recordedTimeBoxes: true
          }
        },
      }
    });

    

    res.status(200).json({ message: 'Goal deleted successfully' });
  } catch (error) {
    Sentry.captureException(error);

    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await prisma.$disconnect();
  }
}