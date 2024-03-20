/*
  Warnings:

  - The required column `id` was added to the `Favorites` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `favoritesId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Favorites_albums_key";

-- DropIndex
DROP INDEX "Favorites_artists_key";

-- DropIndex
DROP INDEX "Favorites_tracks_key";

-- AlterTable
ALTER TABLE "Favorites" ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Favorites_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "favoritesId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_favoritesId_fkey" FOREIGN KEY ("favoritesId") REFERENCES "Favorites"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
