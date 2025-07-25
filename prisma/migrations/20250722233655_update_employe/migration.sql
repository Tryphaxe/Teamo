/*
  Warnings:

  - You are about to drop the column `budget` on the `Employe` table. All the data in the column will be lost.
  - Added the required column `dateNaissance` to the `Employe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `poste` to the `Employe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `salaire` to the `Employe` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Employe" DROP COLUMN "budget",
ADD COLUMN     "dateEntree" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "dateNaissance" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "poste" TEXT NOT NULL,
ADD COLUMN     "salaire" DOUBLE PRECISION NOT NULL;
