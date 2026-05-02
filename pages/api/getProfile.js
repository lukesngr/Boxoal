import prisma from "@/modules/prismaClient";
import * as Sentry from "@sentry/nextjs";
import { accessTokenVerifier } from "@/modules/cognitoVerifier";

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    req.query;
    
    const authHeader = req.headers.authorization;
    const token = authHeader?.split("Bearer ")[1].trim();
    if (!token) {
      throw new Error('no token ')
    }

    const payload = await accessTokenVerifier.verify(token)

    const profile = await prisma.profile.findUnique({
      where: {
        userUUID: payload.sub,
      }
    });
    res.json(profile);
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await prisma.$disconnect();
  }
}
