/*
  Warnings:

  - Added the required column `objectUUID` to the `Goal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `objectUUID` to the `TimeBox` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Goal" ADD COLUMN     "objectUUID" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TimeBox" ADD COLUMN     "objectUUID" TEXT NOT NULL;
