/*
  Warnings:

  - Added the required column `color` to the `TimeBox` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TimeBox" ADD COLUMN     "color" TEXT NOT NULL,
ALTER COLUMN "startTime" SET DATA TYPE TIMESTAMPTZ,
ALTER COLUMN "endTime" SET DATA TYPE TIMESTAMPTZ;
