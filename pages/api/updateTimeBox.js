import prisma from "@/modules/prismaClient";

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let data = req.body;
    let {id, ...alteredData} = data;
    await prisma.timeBox.update({
      where: {
        id: id,
      },
      data: alteredData,
    });
    res.status(200).json({ message: 'Updated TimeBox successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
    console.log(error);
  } finally {
    await prisma.$disconnect();
  }
}