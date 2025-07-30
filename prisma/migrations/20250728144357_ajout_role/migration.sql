-- AlterTable
ALTER TABLE "Administrateur" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'ADMIN';

-- AlterTable
ALTER TABLE "Employe" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'EMPLOYE';
