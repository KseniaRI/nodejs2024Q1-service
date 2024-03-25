/*
  Warnings:

  - Made the column `favoritesId` on table `Album` required. This step will fail if there are existing NULL values in that column.
  - Made the column `favoritesId` on table `Artist` required. This step will fail if there are existing NULL values in that column.
  - Made the column `favoritesId` on table `Track` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Album" ALTER COLUMN "favoritesId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Artist" ALTER COLUMN "favoritesId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Track" ALTER COLUMN "favoritesId" SET NOT NULL;
