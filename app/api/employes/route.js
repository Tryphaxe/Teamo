import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// GET tous les employés
export async function GET() {
  try {
    const employes = await prisma.user.findMany({
      where: {
        role: "EMPLOYE",
      },
      include: {
        departement: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(employes);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erreur lors de la récupération.' }, { status: 500 });
  }
}

// POST créer un employé
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      email,
      password,
      nom,
      prenom,
      telephone,
      adresse,
      genre,
      dateNaissance,
      dateEntree,
      poste,
      salaire,
      departementId
    } = body;

    if (!email || !password || !nom || !prenom || !dateNaissance || !dateEntree || !poste || !salaire || !departementId) {
      return NextResponse.json({ error: 'Champs requis manquants.' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existing) {
      return NextResponse.json({ error: "Email déjà utilisé" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const employe = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        nom,
        prenom,
        telephone,
        adresse,
        genre,
        dateNaissance: new Date(dateNaissance),
        dateEntree: new Date(dateEntree),
        poste,
        salaire: parseFloat(salaire),
        departementId: parseInt(departementId),
      },
    });

    return NextResponse.json(employe, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erreur lors de l’enregistrement.' }, { status: 500 });
  }
}