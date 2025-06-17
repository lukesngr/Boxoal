-- AlterTable
ALTER TABLE "RecordedTimeBox" ADD COLUMN     "reoccuringTimeBoxId" INTEGER;

-- CreateTable
CREATE TABLE "ReoccuringTimeBox" (
    "id" SERIAL NOT NULL,
    "numberOfBoxes" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "reoccurFrequency" INTEGER NOT NULL,
    "weeklyDate" TIMESTAMP(3),
    "goalID" INTEGER,
    "scheduleID" INTEGER,

    CONSTRAINT "ReoccuringTimeBox_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ReoccuringTimeBox" ADD CONSTRAINT "ReoccuringTimeBox_goalID_fkey" FOREIGN KEY ("goalID") REFERENCES "Goal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReoccuringTimeBox" ADD CONSTRAINT "ReoccuringTimeBox_scheduleID_fkey" FOREIGN KEY ("scheduleID") REFERENCES "Schedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecordedTimeBox" ADD CONSTRAINT "RecordedTimeBox_reoccuringTimeBoxId_fkey" FOREIGN KEY ("reoccuringTimeBoxId") REFERENCES "ReoccuringTimeBox"("id") ON DELETE SET NULL ON UPDATE CASCADE;
