-- CreateTable
CREATE TABLE "CompletedHabit" (
    "id" SERIAL NOT NULL,
    "userEmail" TEXT NOT NULL,
    "DateTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompletedHabit_pkey" PRIMARY KEY ("id")
);
