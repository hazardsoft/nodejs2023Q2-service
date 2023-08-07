import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const favoritesEntiryId = 1;

  await prisma.favorites.deleteMany({
    where: {
      id: {
        not: favoritesEntiryId,
      },
    },
  });
  try {
    await prisma.favorites.findUniqueOrThrow({
      where: {
        id: favoritesEntiryId,
      },
    });
  } catch (e) {
    await prisma.favorites.create({});
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
