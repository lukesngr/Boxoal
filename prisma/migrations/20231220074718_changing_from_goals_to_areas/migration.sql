/*
  Warnings:

  - You are about to drop the column `areaID` on the `TimeBox` table. All the data in the column will be lost.
  - You are about to drop the `Area` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Area" DROP CONSTRAINT "Area_scheduleID_fkey";

-- DropForeignKey
ALTER TABLE "TimeBox" DROP CONSTRAINT "TimeBox_areaID_fkey";

-- AlterTable
ALTER TABLE "TimeBox" DROP COLUMN "areaID",
ADD COLUMN     "goalID" INTEGER;

-- DropTable
DROP TABLE "Area";

-- CreateTable
CREATE TABLE "Goal" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "finishDate" TIMESTAMP(3) NOT NULL,
    "priority" INTEGER NOT NULL,
    "scheduleID" INTEGER NOT NULL,

    CONSTRAINT "Goal_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_scheduleID_fkey" FOREIGN KEY ("scheduleID") REFERENCES "Schedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeBox" ADD CONSTRAINT "TimeBox_goalID_fkey" FOREIGN KEY ("goalID") REFERENCES "Goal"("id") ON DELETE SET NULL ON UPDATE CASCADE;
