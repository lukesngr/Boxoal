-- DropForeignKey
ALTER TABLE "Area" DROP CONSTRAINT "Area_timeBoxID_fkey";

-- AlterTable
ALTER TABLE "Area" ALTER COLUMN "timeBoxID" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Area" ADD CONSTRAINT "Area_timeBoxID_fkey" FOREIGN KEY ("timeBoxID") REFERENCES "TimeBox"("id") ON DELETE SET NULL ON UPDATE CASCADE;
