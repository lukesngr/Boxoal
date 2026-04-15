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

    const recordedTimeBox = await prisma.timeBox.findUnique({
      where: { objectUUID: data.objectUUID, schedule: {userUUID: payload.sub} },
      select: { recordedTimeBox: { select: { id: true } } }
    });

    if (recordedTimeBox != null) {
        await prisma.recordedTimeBox.delete({
          where: {
            id: recordedTimeBox.recordedTimeBox.id
          }
        });
    }

    res.status(200).json({ message: 'Recording cleared successfully' });
  } catch (error) {
    Sentry.captureException(error);

    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await prisma.$disconnect();
  }
}
