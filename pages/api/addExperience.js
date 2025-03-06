import prisma from "@/modules/prismaClient";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = req.body;
    console.log(data);
    
    const experienceRecord = await prisma.profile.findUnique({
      where: {
        userUUID: data.userUUID,
      },
    });
    
    if (experienceRecord === null) {
      await prisma.profile.create({
        data: data,
      });
    } else {
      await prisma.profile.update({
        where: {
          userUUID: data.userUUID,
        },
        data: {
          points: { increment: data.points }
        }
      });
    }
    
    res.status(200).json({ message: 'Experience added' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
    console.log(error);
  } finally {
    await prisma.$disconnect();
  }
}