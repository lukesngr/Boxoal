import prisma from "@/modules/prismaClient";

export default async function handler(req, res) {
    try {
        const data = req.body;
        const habits = await prisma.completedHabit.findMany({
            where: {
                userEmail: data.userEmail,
                date: {gte: data.startOfWeek, lte: data.endOfWeek}
            },
            select: {
                date: true,
                title: true
            }})
        res.status(200).json(habits);
    }catch(error) {
        res.status(500).json('Internal Server Error');
        console.log(error);
    }finally {
        await prisma.$disconnect();
    }
}