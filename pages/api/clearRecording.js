import prisma from "@/modules/prismaClient";
import * as Sentry from "@sentry/nextjs";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = req.body;

    const recordedTimeBox = await prisma.timeBox.findUnique({
      where: { objectUUID: data.objectUUID },
      select: { recordedTimeBox: { select: { id: true } } }
    });

    if (recordedTimeBox != null) {
        await prisma.recordedTimeBox.delete({
          where: {
            id: recordedTimeBox.id
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
