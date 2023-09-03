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
            area: {
                select: {
                    id: true,
                    name: true,
                    description: true
                }
            }
        }
    })
    console.log(schedules)
    res.status(200).json(schedules)
}