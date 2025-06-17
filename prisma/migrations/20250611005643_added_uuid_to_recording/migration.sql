/*
  Warnings:

  - A unique constraint covering the columns `[objectUUID]` on the table `RecordedTimeBox` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `objectUUID` to the `RecordedTimeBox` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RecordedTimeBox" ADD COLUMN     "objectUUID" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "RecordedTimeBox_objectUUID_key" ON "RecordedTimeBox"("objectUUID");
