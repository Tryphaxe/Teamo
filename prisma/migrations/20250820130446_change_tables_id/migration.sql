/*
  Warnings:

  - The primary key for the `Client` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Client` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `VarChar(10)`.
  - The primary key for the `Conge` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Conge` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `VarChar(10)`.
  - The primary key for the `Departement` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Departement` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `VarChar(10)`.
  - The primary key for the `Depense` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Depense` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `VarChar(10)`.
  - The primary key for the `Notification` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Notification` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `VarChar(10)`.
  - The primary key for the `Presence` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Presence` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `VarChar(10)`.
  - The primary key for the `Projet` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Projet` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `VarChar(10)`.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `VarChar(10)`.
  - The primary key for the `UserFile` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `UserFile` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `VarChar(10)`.
  - The primary key for the `Vacance` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Vacance` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `VarChar(10)`.

*/
-- DropForeignKey
ALTER TABLE "Conge" DROP CONSTRAINT "Conge_employeId_fkey";

-- DropForeignKey
ALTER TABLE "Depense" DROP CONSTRAINT "Depense_employeId_fkey";

-- DropForeignKey
ALTER TABLE "Depense" DROP CONSTRAINT "Depense_projetId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_senderId_fkey";

-- DropForeignKey
ALTER TABLE "Presence" DROP CONSTRAINT "Presence_employeId_fkey";

-- DropForeignKey
ALTER TABLE "Projet" DROP CONSTRAINT "Projet_clientId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_departementId_fkey";

-- DropForeignKey
ALTER TABLE "UserFile" DROP CONSTRAINT "UserFile_userId_fkey";

-- AlterTable
ALTER TABLE "Client" DROP CONSTRAINT "Client_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE VARCHAR(10),
ADD CONSTRAINT "Client_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Client_id_seq";

-- AlterTable
ALTER TABLE "Conge" DROP CONSTRAINT "Conge_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE VARCHAR(10),
ALTER COLUMN "employeId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Conge_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Conge_id_seq";

-- AlterTable
ALTER TABLE "Departement" DROP CONSTRAINT "Departement_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE VARCHAR(10),
ADD CONSTRAINT "Departement_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Departement_id_seq";

-- AlterTable
ALTER TABLE "Depense" DROP CONSTRAINT "Depense_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE VARCHAR(10),
ALTER COLUMN "employeId" SET DATA TYPE TEXT,
ALTER COLUMN "projetId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Depense_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Depense_id_seq";

-- AlterTable
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE VARCHAR(10),
ALTER COLUMN "senderId" SET DATA TYPE TEXT,
ALTER COLUMN "receiverId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Notification_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Notification_id_seq";

-- AlterTable
ALTER TABLE "Presence" DROP CONSTRAINT "Presence_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE VARCHAR(10),
ALTER COLUMN "employeId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Presence_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Presence_id_seq";

-- AlterTable
ALTER TABLE "Projet" DROP CONSTRAINT "Projet_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE VARCHAR(10),
ALTER COLUMN "clientId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Projet_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Projet_id_seq";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE VARCHAR(10),
ALTER COLUMN "departementId" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- AlterTable
ALTER TABLE "UserFile" DROP CONSTRAINT "UserFile_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE VARCHAR(10),
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "UserFile_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "UserFile_id_seq";

-- AlterTable
ALTER TABLE "Vacance" DROP CONSTRAINT "Vacance_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE VARCHAR(10),
ADD CONSTRAINT "Vacance_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Vacance_id_seq";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_departementId_fkey" FOREIGN KEY ("departementId") REFERENCES "Departement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFile" ADD CONSTRAINT "UserFile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Projet" ADD CONSTRAINT "Projet_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Depense" ADD CONSTRAINT "Depense_employeId_fkey" FOREIGN KEY ("employeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Depense" ADD CONSTRAINT "Depense_projetId_fkey" FOREIGN KEY ("projetId") REFERENCES "Projet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conge" ADD CONSTRAINT "Conge_employeId_fkey" FOREIGN KEY ("employeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Presence" ADD CONSTRAINT "Presence_employeId_fkey" FOREIGN KEY ("employeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
