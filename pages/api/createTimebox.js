import { PrismaClient } from "@prisma/client";

export default async function handler(req, res) {
    const data = req.body;
    const prisma = new PrismaClient();
    await prisma.timeBox.create({
        data: data
    })
    res.status(200)
}