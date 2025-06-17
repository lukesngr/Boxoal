/*
  Warnings:

  - You are about to drop the column `reoccuringTimeBoxId` on the `RecordedTimeBox` table. All the data in the column will be lost.
  - You are about to drop the `ReoccuringTimeBox` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RecordedTimeBox" DROP CONSTRAINT "RecordedTimeBox_reoccuringTimeBoxId_fkey";

-- DropForeignKey
ALTER TABLE "ReoccuringTimeBox" DROP CONSTRAINT "ReoccuringTimeBox_goalID_fkey";

-- DropForeignKey
ALTER TABLE "ReoccuringTimeBox" DROP CONSTRAINT "ReoccuringTimeBox_scheduleID_fkey";

-- AlterTable
ALTER TABLE "RecordedTimeBox" DROP COLUMN "reoccuringTimeBoxId";

-- AlterTable
ALTER TABLE "TimeBox" ADD COLUMN     "reoccuringID" INTEGER;

-- DropTable
DROP TABLE "ReoccuringTimeBox";

-- CreateTable
CREATE TABLE "Reoccuring" (
    "id" SERIAL NOT NULL,
    "reoccurFrequency" TEXT NOT NULL,
    "weeklyDay" TEXT,

    CONSTRAINT "Reoccuring_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TimeBox" ADD CONSTRAINT "TimeBox_reoccuringID_fkey" FOREIGN KEY ("reoccuringID") REFERENCES "Reoccuring"("id") ON DELETE SET NULL ON UPDATE CASCADE;
