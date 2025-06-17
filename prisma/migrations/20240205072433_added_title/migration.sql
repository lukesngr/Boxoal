/*
  Warnings:

  - Added the required column `title` to the `CompletedHabit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CompletedHabit" ADD COLUMN     "title" TEXT NOT NULL;
