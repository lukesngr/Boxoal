import prisma from "@/modules/prismaClient";

export default async function handler(req, res) {
    const data = req.body;
    await prisma.area.create({
        data: data
    })
    res.status(200)
}