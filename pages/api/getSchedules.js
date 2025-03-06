import prisma from "@/modules/prismaClient";

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = req.query;
    console.log(data);
    const schedules = await prisma.schedule.findMany({
      where: {
        userUUID: data.userUUID,
      },
      select: {
        id: true,
        title: true,
        goals: {
          orderBy: {
            priority: 'asc'
          },
          select: {
            id: true,
            title: true,
            priority: true,
            targetDate: true,
            completed: true,
            completedOn: true,
            active: true,
            partOfLine: true,
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
                recordedTimeBoxes: {
                  select: {
                    id: true,
                    timeBox: { select: { id: true, title: true, description: true }}
                  }
                },
                reoccuring: {
                  select: {
                    id: true,
                    reoccurFrequency: true,
                    weeklyDay: true
                  }
                },
                goalPercentage: true,
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
            recordedTimeBoxes: {
              select: {
                id: true,
                recordedStartTime: true,
                timeBoxID: true,
                timeBox: { select: { title: true, description: true }}
              }
            },
            goalID: true,
            reoccuring: {
              select: {
                id: true,
                reoccurFrequency: true,
                weeklyDay: true
              }
            },
            goalPercentage: true
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
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await prisma.$disconnect();
  }
}