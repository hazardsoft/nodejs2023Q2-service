import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const favoritesEntiryId = 1;

  await prisma.favorite.deleteMany({
    where: {
      id: {
        not: favoritesEntiryId,
      },
    },
  });
  try {
    await prisma.favorite.findUniqueOrThrow({
      where: {
        id: favoritesEntiryId,
      },
    });
  } catch (e) {
    await prisma.favorite.create({});
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
