import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// GET tous les employés
export async function GET() {
  try {
    const admins = await prisma.administrateur.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(admins);
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
      nom,
      prenom,
      email,
      password,
    } = body;

    if (!nom || !prenom || !email || !password) {
      return NextResponse.json({ error: 'Champs requis manquants.' }, { status: 400 });
    }

    const existing = await prisma.administrateur.findUnique({
      where: { email: email },
    });

    if (existing) {
      return NextResponse.json({ error: "Email déjà utilisé" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.administrateur.create({
      data: {
        nom,
        prenom,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(admin, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erreur lors de l’enregistrement.' }, { status: 500 });
  }
}