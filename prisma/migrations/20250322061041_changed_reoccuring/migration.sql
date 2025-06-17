/*
  Warnings:

  - You are about to drop the column `reoccurFrequency` on the `Reoccuring` table. All the data in the column will be lost.
  - You are about to drop the column `weeklyDay` on the `Reoccuring` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Reoccuring" DROP COLUMN "reoccurFrequency",
DROP COLUMN "weeklyDay",
ADD COLUMN     "endOfDayRange" INTEGER,
ADD COLUMN     "startOfDayRange" INTEGER;
