import { PrismaClient } from "@prisma/client";

export default function handler(req, res) {
    const data = req.body;
    const prisma = new PrismaClient();
    const schedules = prisma.schedule.findMany({
        where: {
            userEmail: data.userEmail
        }
    })
    res.status(200).json(schedules)
}