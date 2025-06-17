/*
  Warnings:

  - You are about to drop the column `weeklyDay` on the `Reoccuring` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Reoccuring" DROP COLUMN "weeklyDay",
ADD COLUMN     "weeklyDate" TIMESTAMP(3);
