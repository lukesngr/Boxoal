-- AlterTable
ALTER TABLE "TimeBox" ADD COLUMN     "scheduleID" INTEGER;

-- AddForeignKey
ALTER TABLE "TimeBox" ADD CONSTRAINT "TimeBox_scheduleID_fkey" FOREIGN KEY ("scheduleID") REFERENCES "Schedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;
