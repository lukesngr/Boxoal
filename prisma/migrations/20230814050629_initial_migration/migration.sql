-- CreateTable
CREATE TABLE "Schedule" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "boxSize" TEXT NOT NULL,
    "endDate" TEXT NOT NULL,
    "wakeupTime" INTEGER NOT NULL,
    "areaID" INTEGER NOT NULL,
    "userEmail" TEXT NOT NULL,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Area" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "timeBoxID" INTEGER NOT NULL,

    CONSTRAINT "Area_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimeBox" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "recordedTimeBoxID" INTEGER NOT NULL,

    CONSTRAINT "TimeBox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecordedTimeBox" (
    "id" SERIAL NOT NULL,
    "recordedStartTime" TIMESTAMP(3) NOT NULL,
    "recordedEndTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecordedTimeBox_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_areaID_fkey" FOREIGN KEY ("areaID") REFERENCES "Area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Area" ADD CONSTRAINT "Area_timeBoxID_fkey" FOREIGN KEY ("timeBoxID") REFERENCES "TimeBox"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeBox" ADD CONSTRAINT "TimeBox_recordedTimeBoxID_fkey" FOREIGN KEY ("recordedTimeBoxID") REFERENCES "RecordedTimeBox"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
