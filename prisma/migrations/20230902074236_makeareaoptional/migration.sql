-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_areaID_fkey";

-- AlterTable
ALTER TABLE "Schedule" ALTER COLUMN "areaID" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_areaID_fkey" FOREIGN KEY ("areaID") REFERENCES "Area"("id") ON DELETE SET NULL ON UPDATE CASCADE;
