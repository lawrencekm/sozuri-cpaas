-- CreateTable
CREATE TABLE "MessageStats" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "engagement" INTEGER NOT NULL DEFAULT 0,
    "successRate" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "MessageStats_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "MessageStats_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "MessageStats_projectId_key" ON "MessageStats"("projectId");
