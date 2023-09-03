/*
  Warnings:

  - You are about to drop the column `areaID` on the `Schedule` table. All the data in the column will be lost.
  - Added the required column `scheduleID` to the `Area` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_areaID_fkey";

-- AlterTable
ALTER TABLE "Area" ADD COLUMN     "scheduleID" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Schedule" DROP COLUMN "areaID";

-- AddForeignKey
ALTER TABLE "Area" ADD CONSTRAINT "Area_scheduleID_fkey" FOREIGN KEY ("scheduleID") REFERENCES "Schedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
