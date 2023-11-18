/*
  Warnings:

  - Added the required column `numberOfBoxes` to the `TimeBox` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TimeBox" ADD COLUMN     "numberOfBoxes" INTEGER NOT NULL;
