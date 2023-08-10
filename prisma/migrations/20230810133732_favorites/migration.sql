/*
  Warnings:

  - You are about to drop the `Favorites` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Favorites";

-- CreateTable
CREATE TABLE "FavoriteTrack" (
    "trackId" TEXT NOT NULL,
    "favoriteId" INTEGER NOT NULL,

    CONSTRAINT "FavoriteTrack_pkey" PRIMARY KEY ("trackId","favoriteId")
);

-- CreateTable
CREATE TABLE "FavoriteAlbum" (
    "albumId" TEXT NOT NULL,
    "favoriteId" INTEGER NOT NULL,

    CONSTRAINT "FavoriteAlbum_pkey" PRIMARY KEY ("albumId","favoriteId")
);

-- CreateTable
CREATE TABLE "FavoriteArtist" (
    "artistId" TEXT NOT NULL,
    "favoriteId" INTEGER NOT NULL,

    CONSTRAINT "FavoriteArtist_pkey" PRIMARY KEY ("artistId","favoriteId")
);

-- CreateTable
CREATE TABLE "Favorite" (
    "id" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FavoriteTrack_trackId_key" ON "FavoriteTrack"("trackId");

-- CreateIndex
CREATE UNIQUE INDEX "FavoriteAlbum_albumId_key" ON "FavoriteAlbum"("albumId");

-- CreateIndex
CREATE UNIQUE INDEX "FavoriteArtist_artistId_key" ON "FavoriteArtist"("artistId");

-- AddForeignKey
ALTER TABLE "FavoriteTrack" ADD CONSTRAINT "FavoriteTrack_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteTrack" ADD CONSTRAINT "FavoriteTrack_favoriteId_fkey" FOREIGN KEY ("favoriteId") REFERENCES "Favorite"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteAlbum" ADD CONSTRAINT "FavoriteAlbum_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteAlbum" ADD CONSTRAINT "FavoriteAlbum_favoriteId_fkey" FOREIGN KEY ("favoriteId") REFERENCES "Favorite"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteArtist" ADD CONSTRAINT "FavoriteArtist_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteArtist" ADD CONSTRAINT "FavoriteArtist_favoriteId_fkey" FOREIGN KEY ("favoriteId") REFERENCES "Favorite"("id") ON DELETE CASCADE ON UPDATE CASCADE;
