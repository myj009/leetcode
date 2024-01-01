/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the column `isCorrect` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the column `lang` on the `Submission` table. All the data in the column will be lost.
  - Added the required column `language` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Submission` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('AC', 'WA');

-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "createdAt",
DROP COLUMN "isCorrect",
DROP COLUMN "lang",
ADD COLUMN     "language" "Language" NOT NULL,
ADD COLUMN     "status" "SubmissionStatus" NOT NULL,
ADD COLUMN     "submittedOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "language" "Language" NOT NULL DEFAULT 'cpp';

-- CreateTable
CREATE TABLE "BoilerPlateCode" (
    "problemId" INTEGER NOT NULL,
    "language" "Language" NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "BoilerPlateCode_pkey" PRIMARY KEY ("problemId","language")
);

-- CreateIndex
CREATE INDEX "BoilerPlateCode_problemId_idx" ON "BoilerPlateCode"("problemId");

-- AddForeignKey
ALTER TABLE "BoilerPlateCode" ADD CONSTRAINT "BoilerPlateCode_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
