/*
  Warnings:

  - You are about to drop the column `boxSize` on the `Schedule` table. All the data in the column will be lost.
  - Added the required column `boxSizeNumber` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `boxSizeUnit` to the `Schedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Schedule" DROP COLUMN "boxSize",
ADD COLUMN     "boxSizeNumber" INTEGER NOT NULL,
ADD COLUMN     "boxSizeUnit" TEXT NOT NULL;
