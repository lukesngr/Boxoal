import prisma from "@/modules/prismaClient";
import * as Sentry from "@sentry/nextjs";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split("Bearer ")[1].trim();
    if (!token) {
      throw new Error('no token ')
    }

    const payload = await accessTokenVerifier.verify(token);

    const data = req.body;
    
    const goal = await prisma.goal.findFirst({
      where: {
       id: data.id,
       schedule: {
        userId: payload.sub
       }
     }
    });

    if (!goal) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await prisma.loggingOfMetric.deleteMany({
      where: {
        goalID: data.id
      }
    });

    await prisma.goal.delete({
      where: {
        id: data.id,
      },
      include: {
        timeboxes: {
          include: {
            recordedTimeBox: true
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
