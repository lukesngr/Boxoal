/*
  Warnings:

  - You are about to drop the column `weeklyDate` on the `Reoccuring` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Reoccuring" DROP COLUMN "weeklyDate",
ADD COLUMN     "weeklyDay" INTEGER;
