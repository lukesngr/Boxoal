import prisma from "@/modules/prismaClient";
import { accessTokenVerifier } from "@/modules/cognitoVerifier";
import * as Sentry from "@sentry/nextjs";

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    
    const authHeader = req.headers.authorization;
    const token = authHeader?.split("Bearer ")[1].trim();
    if (!token) {
      throw new Error('no token ')
    }

    const payload = await accessTokenVerifier.verify(token);
    // payload contains: sub, username, cognito:groups, exp, etc.
    const schedules = await prisma.schedule.findMany({
      where: {
        userUUID: payload.sub,
      },
      select: {
        id: true,
        title: true,
        goalStatistics: {
          select: {
            goalsActive: true,
            goalsCompleted: true,
          }
        },
        goals: {
          orderBy: {
            targetDate: 'asc'
          },
          select: {
            id: true,
            title: true,
            targetDate: true,
            completed: true,
            completedOn: true,
            active: true,
            partOfLine: true,
            objectUUID: true,
	    scheduleID: true,
            metric: true,
            state: true,
            loggingsOfMetric: {
              select: {
                date: true,
                metric: true,
              }
            },
         },
        },
        timeboxes: {
          orderBy: [
		{reoccuringID: {sort: 'asc', nulls: 'first'}}, {
                startTime: 'asc'
              }],
          select: {
            title: true,
            description: true,
            startTime: true,
            endTime: true,
            numberOfBoxes: true,
            color: true,
            isTimeblock: true,
            objectUUID: true,
            goalID: true,
            reoccuring: {
              select: {
                id: true,
                startOfDayRange: true,
                endOfDayRange: true,
              }
            },
          }
        },
        recordedTimeboxes: {
          orderBy: {
            recordedStartTime: 'asc'
          },
          select: {
            id: true,
            recordedStartTime: true,
            recordedEndTime: true,
            objectUUID: true,
	    timeboxUUID: true,
          }
        }
      },
    });

    res.json(schedules);
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ error: 'Internal Server Error'});
  } finally {
    await prisma.$disconnect();
  }
}
