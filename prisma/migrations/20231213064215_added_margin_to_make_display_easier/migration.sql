/*
  Warnings:

  - Added the required column `marginTop` to the `RecordedTimeBox` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RecordedTimeBox" ADD COLUMN     "marginTop" INTEGER NOT NULL;
