import prisma from "@/modules/prismaClient";
import * as Sentry from "@sentry/nextjs";
import { accessTokenVerifier } from "@/modules/cognitoVerifier";

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
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
    const profile = await prisma.profile.findUnique({
      where: {
        userUUID: payload.sub,
      }
    });

    if(profile === null) {
      await prisma.profile.create({
        data: data,
      });
    }

    await prisma.profile.update({
      where: {
        userUUID: payload.sub, // Fixed: was userUUID without data. prefix
      },
      data: data,
    });
    res.status(200).json({ message: 'Updated Profile successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
    Sentry.captureException(error);
  } finally {
    await prisma.$disconnect();
  }
}
