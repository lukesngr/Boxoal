/*
  Warnings:

  - A unique constraint covering the columns `[objectUUID]` on the table `Goal` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[objectUUID]` on the table `TimeBox` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Goal_objectUUID_key" ON "Goal"("objectUUID");

-- CreateIndex
CREATE UNIQUE INDEX "TimeBox_objectUUID_key" ON "TimeBox"("objectUUID");
