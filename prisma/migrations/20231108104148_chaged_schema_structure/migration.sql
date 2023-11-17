/*
  Warnings:

  - You are about to drop the column `timeBoxID` on the `Area` table. All the data in the column will be lost.
  - You are about to drop the column `recordedTimeBoxID` on the `TimeBox` table. All the data in the column will be lost.
  - Added the required column `timeBoxID` to the `RecordedTimeBox` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Area" DROP CONSTRAINT "Area_timeBoxID_fkey";

-- DropForeignKey
ALTER TABLE "TimeBox" DROP CONSTRAINT "TimeBox_recordedTimeBoxID_fkey";

-- AlterTable
ALTER TABLE "Area" DROP COLUMN "timeBoxID";

-- AlterTable
ALTER TABLE "RecordedTimeBox" ADD COLUMN     "timeBoxID" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "TimeBox" DROP COLUMN "recordedTimeBoxID",
ADD COLUMN     "areaID" INTEGER;

-- AddForeignKey
ALTER TABLE "TimeBox" ADD CONSTRAINT "TimeBox_areaID_fkey" FOREIGN KEY ("areaID") REFERENCES "Area"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecordedTimeBox" ADD CONSTRAINT "RecordedTimeBox_timeBoxID_fkey" FOREIGN KEY ("timeBoxID") REFERENCES "TimeBox"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
