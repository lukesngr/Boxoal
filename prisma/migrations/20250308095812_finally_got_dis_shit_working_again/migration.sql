/*
  Warnings:

  - You are about to drop the column `name` on the `Goal` table. All the data in the column will be lost.
  - You are about to drop the column `boxSizeNumber` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the column `boxSizeUnit` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the column `userEmail` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the column `wakeupTime` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the `CompletedHabit` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `active` to the `Goal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `completed` to the `Goal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `completedOn` to the `Goal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `partOfLine` to the `Goal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Goal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userUUID` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `goalPercentage` to the `TimeBox` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Goal" DROP COLUMN "name",
ADD COLUMN     "active" BOOLEAN NOT NULL,
ADD COLUMN     "completed" BOOLEAN NOT NULL,
ADD COLUMN     "completedOn" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "partOfLine" INTEGER NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Schedule" DROP COLUMN "boxSizeNumber",
DROP COLUMN "boxSizeUnit",
DROP COLUMN "endDate",
DROP COLUMN "name",
DROP COLUMN "userEmail",
DROP COLUMN "wakeupTime",
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "userUUID" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TimeBox" ADD COLUMN     "goalPercentage" INTEGER NOT NULL;

-- DropTable
DROP TABLE "CompletedHabit";

-- CreateTable
CREATE TABLE "Profile" (
    "userUUID" TEXT NOT NULL,
    "boxSizeUnit" TEXT NOT NULL,
    "boxSizeNumber" INTEGER NOT NULL,
    "wakeupTime" TEXT NOT NULL,
    "scheduleID" INTEGER NOT NULL,
    "scheduleIndex" INTEGER NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("userUUID")
);
