import prisma from "@/modules/prismaClient";

export default async function handler(req, res) {
    const data = req.body;
    const schedules = await prisma.schedule.findMany({
        where: {
            userEmail: data.userEmail,
        },
        select: {
            id: true,
            name: true,
            boxSizeNumber: true,
            boxSizeUnit: true,
            wakeupTime: true,
            goals: {
                select: {
                    id: true,
                    name: true,
                }
            },
            timeboxes: {
                orderBy: {
                    startTime: 'asc'
                },
                select: {
                    title: true,
                    description: true,
                    startTime: true,
                    endTime: true,
                    numberOfBoxes: true,
                    color: true,
                    id: true,
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
                    timeBox: {
                        select: {
                            title: true
                        }
                    }
                }
            }
        }
    })
    res.status(200).json(schedules)
}