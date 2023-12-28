/*
  Warnings:

  - You are about to drop the column `finishDate` on the `Goal` table. All the data in the column will be lost.
  - Added the required column `targetDate` to the `Goal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Goal" DROP COLUMN "finishDate",
ADD COLUMN     "targetDate" TIMESTAMP(3) NOT NULL;
