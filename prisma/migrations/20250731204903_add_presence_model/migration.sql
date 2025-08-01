-- CreateTable
CREATE TABLE "Presence" (
    "id" SERIAL NOT NULL,
    "employeId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "present" BOOLEAN NOT NULL,

    CONSTRAINT "Presence_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Presence" ADD CONSTRAINT "Presence_employeId_fkey" FOREIGN KEY ("employeId") REFERENCES "Employe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
