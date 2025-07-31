import prisma from "@/modules/prismaClient";
import * as Sentry from "@sentry/nextjs";

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = req.query;

    if (!data.userUUID || typeof data.userUUID !== 'string') {
            return res.status(400).json({ 
                error: 'userUUID is required' 
             });
    }
    const schedules = await prisma.schedule.findMany({
      where: {
        userUUID: data.userUUID,
      },
      select: {
        id: true,
        title: true,
        goals: {
          select: {
            id: true,
            title: true,
            targetDate: true,
            completed: true,
            completedOn: true,
            active: true,
            partOfLine: true,
            objectUUID: true,
            metric: true,
            loggingsOfMetric: {
              select: {
                date: true,
                metric: true,
              }
            },
            timeboxes: {
              orderBy: {
                startTime: 'asc'
              },
              where: {
                OR: [{reoccuringID: null}, {NOT: {reoccuringID: null}}]
              },
              select: {
                title: true,
                description: true,
                startTime: true,
                endTime: true,
                numberOfBoxes: true,
                color: true,
                id: true,
                isTimeblock: true,
                objectUUID: true,
                recordedTimeBoxes: {
                  select: {
                    id: true,
                    objectUUID: true,
                    timeBox: { select: { id: true, title: true, description: true }}
                  }
                },
                reoccuring: {
                  select: {
                    id: true,
                    startOfDayRange: true,
                    endOfDayRange: true,
                  }
                },
                goalID: true
              },
            }
          },
        },
        timeboxes: {
          orderBy: {
            startTime: 'asc'
          },
          where: {
            startTime: {
              gte: data.startOfWeek,
              lte: data.endOfWeek
            }
          },
          select: {
            title: true,
            description: true,
            startTime: true,
            endTime: true,
            numberOfBoxes: true,
            color: true,
            id: true,
            isTimeblock: true,
            objectUUID: true,
            recordedTimeBoxes: {
              select: {
                id: true,
                recordedStartTime: true,
                recordedEndTime: true,
                timeBoxID: true,
                objectUUID: true,
                timeBox: { select: { title: true, description: true }}
              }
            },
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
          where: {
            recordedStartTime: {
              gte: data.startOfWeek,
              lte: data.endOfWeek
            }
          },
          select: {
            id: true,
            recordedStartTime: true,
            recordedEndTime: true,
            objectUUID: true,
            timeBox: {
              select: {
                id: true, 
                title: true, 
                description: true,
                startTime: true,
                endTime: true,
              }
            }
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