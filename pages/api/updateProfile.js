import prisma from "@/modules/prismaClient";

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let data = req.body;

    const profile = await prisma.profile.findUnique({
      where: {
        userUUID: data.userUUID,
      }
    });

    if(profile === null) {
      await prisma.profile.create({
        data: data,
      });
    }

    await prisma.profile.update({
      where: {
        userUUID: data.userUUID, // Fixed: was userUUID without data. prefix
      },
      data: data,
    });
    res.status(200).json({ message: 'Updated Profile successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
    console.log(error);
  } finally {
    await prisma.$disconnect();
  }
}