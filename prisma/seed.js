import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Hash des mots de passe (important pour la sécurité)
  const hashedAdminPassword = await bcrypt.hash('admin123', 10);
  const hashedEmpPassword = await bcrypt.hash('employe123', 10);

  // Création d'un admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@entreprise.com' },
    update: {},
    create: {
      email: 'admin@entreprise.com',
      password: hashedAdminPassword,
      nom: 'Super',
      prenom: 'Admin',
      role: 'ADMIN', // ⚡ ton enum Role doit contenir ADMIN
    },
  });

  // Création d’un employé
  const employe = await prisma.user.upsert({
    where: { email: 'employe@entreprise.com' },
    update: {},
    create: {
      email: 'employe@entreprise.com',
      password: hashedEmpPassword,
      nom: 'Doe',
      prenom: 'John',
      role: 'EMPLOYE',
      poste: 'Développeur Web',
      salaire: 1500000,
      adresse: 'Abidjan, Cocody',
      genre: 'Homme',
      telephone: '+22501020304',
      dateNaissance: new Date('1995-06-15'),
      departement: {
        connectOrCreate: {
          where: { id: 'IT' }, // Id du département (exemple)
          create: { id: 'IT', nom: 'Informatique' },
        },
      },
    },
  });

  console.log({ admin, employe });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
