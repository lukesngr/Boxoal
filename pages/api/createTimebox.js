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

    const payload = await accessTokenVerifier.verify(token);
    
    const schedule = await prisma.schedule.findFirst({
     where: {
      id: data.scheduleId,
      userUUID: payload.sub
     }
    });

    if (!schedule) return res.status(403).json({ error: 'Unauthorized' });
    
    await prisma.timeBox.create({
      data: data,
    });
    res.status(200).json({ message: 'TimeBox created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
    Sentry.captureException(error);
  } finally {
    await prisma.$disconnect();
  }
}
