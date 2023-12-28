-- DropForeignKey
ALTER TABLE "Goal" DROP CONSTRAINT "Goal_scheduleID_fkey";

-- DropForeignKey
ALTER TABLE "RecordedTimeBox" DROP CONSTRAINT "RecordedTimeBox_scheduleID_fkey";

-- DropForeignKey
ALTER TABLE "RecordedTimeBox" DROP CONSTRAINT "RecordedTimeBox_timeBoxID_fkey";

-- AlterTable
ALTER TABLE "Goal" ALTER COLUMN "scheduleID" DROP NOT NULL;

-- AlterTable
ALTER TABLE "RecordedTimeBox" ALTER COLUMN "timeBoxID" DROP NOT NULL,
ALTER COLUMN "scheduleID" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_scheduleID_fkey" FOREIGN KEY ("scheduleID") REFERENCES "Schedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecordedTimeBox" ADD CONSTRAINT "RecordedTimeBox_timeBoxID_fkey" FOREIGN KEY ("timeBoxID") REFERENCES "TimeBox"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecordedTimeBox" ADD CONSTRAINT "RecordedTimeBox_scheduleID_fkey" FOREIGN KEY ("scheduleID") REFERENCES "Schedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;
