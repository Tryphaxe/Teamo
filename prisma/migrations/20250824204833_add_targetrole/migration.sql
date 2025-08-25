-- CreateEnum
CREATE TYPE "public"."RoleNotif" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "public"."Notification" ADD COLUMN     "targetRole" "public"."RoleNotif" NOT NULL DEFAULT 'USER';
