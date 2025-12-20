/*
  Warnings:

  - The primary key for the `Draft` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `questions` on the `Form` table. All the data in the column will be lost.
  - You are about to drop the column `choices` on the `Question` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[formId]` on the table `Draft` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `order` to the `Choice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `questionId` to the `Choice` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `Draft` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `formId` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `Question` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('text', 'textarea', 'single', 'radio', 'checkbox');

-- AlterTable
ALTER TABLE "Choice" ADD COLUMN     "order" INTEGER NOT NULL,
ADD COLUMN     "questionId" TEXT NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Draft" DROP CONSTRAINT "Draft_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "lastHash" TEXT,
ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "submitted" SET DEFAULT false,
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "Draft_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Form" DROP COLUMN "questions",
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "choices",
ADD COLUMN     "formId" TEXT NOT NULL,
ADD COLUMN     "order" INTEGER NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" "QuestionType" NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "Choice_questionId_order_idx" ON "Choice"("questionId", "order");

-- CreateIndex
CREATE INDEX "Draft_formId_idx" ON "Draft"("formId");

-- CreateIndex
CREATE UNIQUE INDEX "Draft_formId_key" ON "Draft"("formId");

-- CreateIndex
CREATE INDEX "Question_formId_order_idx" ON "Question"("formId", "order");

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Choice" ADD CONSTRAINT "Choice_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
