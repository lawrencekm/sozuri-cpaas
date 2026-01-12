/*
  Warnings:

  - A unique constraint covering the columns `[projectId,name]` on the table `Campaign` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,name]` on the table `Project` will be added. If there are existing duplicate values, this will fail.

  Pre-cleanup: delete later duplicates keeping earliest (lowest createdAt or id) to allow unique indexes.
*/

-- 1) Campaign duplicates: keep earliest by createdAt (fallback to id), delete later ones
WITH ranked AS (
  SELECT id,
         ROW_NUMBER() OVER (
           PARTITION BY "projectId", name
           ORDER BY COALESCE("createdAt", '1900-01-01'::timestamp) ASC, id ASC
         ) AS rn
  FROM "public"."Campaign"
)
DELETE FROM "public"."Campaign" c
USING ranked r
WHERE c.id = r.id AND r.rn > 1;

-- 2) Project duplicates: keep earliest by createdAt (fallback to id), delete later ones
WITH ranked_proj AS (
  SELECT id,
         ROW_NUMBER() OVER (
           PARTITION BY "userId", name
           ORDER BY COALESCE("createdAt", '1900-01-01'::timestamp) ASC, id ASC
         ) AS rn
  FROM "public"."Project"
)
DELETE FROM "public"."Project" p
USING ranked_proj r
WHERE p.id = r.id AND r.rn > 1;

-- 3) Drop global unique index on Project.name
DROP INDEX IF EXISTS "public"."Project_name_key";

-- 4) Create scoped unique indexes
CREATE UNIQUE INDEX IF NOT EXISTS "Campaign_projectId_name_key" ON "public"."Campaign"("projectId", "name");
CREATE UNIQUE INDEX IF NOT EXISTS "Project_userId_name_key" ON "public"."Project"("userId", "name");
