/*
  Warnings:

  - You are about to drop the column `DateTime` on the `CompletedHabit` table. All the data in the column will be lost.
  - Added the required column `date` to the `CompletedHabit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CompletedHabit" DROP COLUMN "DateTime",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL;
