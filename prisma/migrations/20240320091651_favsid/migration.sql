-- AlterTable
ALTER TABLE "Album" ALTER COLUMN "favoritesId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Artist" ALTER COLUMN "favoritesId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Track" ALTER COLUMN "favoritesId" DROP NOT NULL;
