/*
  Warnings:

  - Added the required column `scheduleID` to the `RecordedTimeBox` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RecordedTimeBox" ADD COLUMN     "scheduleID" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "RecordedTimeBox" ADD CONSTRAINT "RecordedTimeBox_scheduleID_fkey" FOREIGN KEY ("scheduleID") REFERENCES "Schedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
