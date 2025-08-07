import prisma from "@/modules/prismaClient";
import * as Sentry from "@sentry/nextjs";

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = req.query;
    const nextGoal = await prisma.goal.findFirst({
      where: {
        partOfLine: data.line,
        active: false,
        completed: false,
      },
      orderBy: {
        id: 'asc'
      }
    });

    if(nextGoal !== null) {

      const updatedGoal = await prisma.goal.update({
        where: {
          id: nextGoal.id
        },
        data: {
          active: true
        }
      });
      res.json(updatedGoal);
      
    }else{
      res.json({ message: "No next goal found" });
    }

    
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await prisma.$disconnect();
  }
}