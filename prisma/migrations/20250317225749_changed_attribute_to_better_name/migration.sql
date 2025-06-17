/*
  Warnings:

  - You are about to drop the column `timeboxMode` on the `TimeBox` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TimeBox" DROP COLUMN "timeboxMode",
ADD COLUMN     "isTimeblock" BOOLEAN;
