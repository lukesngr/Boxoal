import prisma from "@/modules/prismaClient";
import * as Sentry from "@sentry/nextjs";
import { accessTokenVerifier } from "@/modules/cognitoVerifier";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = req.body;
    const authHeader = req.headers.authorization;
    const token = authHeader?.split("Bearer ")[1].trim();
    if (!token) {
      throw new Error('no token ')
    }

    const payload = await accessTokenVerifier.verify(token)
    
    
    const schedule = await prisma.schedule.findFirst({
      where: {
       id: data.scheduleId,
       userUUID: payload.sub
      }
    });

    if (!schedule) return res.status(403).json({ error: 'Unauthorized' });
    
    const recordedTimeBox = await prisma.timeBox.findUnique({
      where: { objectUUID: data.objectUUID },
      select: { recordedTimeBox: { select: { id: true } } }
    });

    if (recordedTimeBox.recordedTimeBox) {
        await prisma.recordedTimeBox.delete({
          where: {
            id: recordedTimeBox.recordedTimeBox.id
          }
        });
    }

    await prisma.timeBox.delete({
      where: {
        objectUUID: data.objectUUID
      }
    });

    res.status(200).json({ message: 'TimeBox deleted successfully' });
  } catch (error) {
    Sentry.captureException(error);

    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await prisma.$disconnect();
  }
}
