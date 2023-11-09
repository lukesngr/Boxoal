import { PrismaClient } from "@prisma/client";

export default async function handler(req, res) {
    const data = req.body;
    const prisma = new PrismaClient();
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
            areas: {
                select: {
                    id: true,
                    name: true,
                    description: true
                }
            },
            timeboxes: {
                select: {
                    title: true,
                    description: true,
                    startTime: true,
                    endTime: true
                }
            }
        }
    })
    res.status(200).json(schedules)
}