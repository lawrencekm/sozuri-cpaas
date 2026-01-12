-- AlterTable
ALTER TABLE "public"."Project" ADD COLUMN     "type" TEXT DEFAULT 'transactional';

-- CreateTable
CREATE TABLE "public"."MessageStats" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "engagement" INTEGER NOT NULL DEFAULT 0,
    "successRate" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MessageStats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MessageStats_projectId_key" ON "public"."MessageStats"("projectId");

-- AddForeignKey
ALTER TABLE "public"."MessageStats" ADD CONSTRAINT "MessageStats_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
