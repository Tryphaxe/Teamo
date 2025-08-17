import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// GET tous les admins
export async function GET() {
  try {
    const admins = await prisma.user.findMany({
      where: { role: 'ADMIN' },
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

// POST créer un admin
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

    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json({ error: "Email déjà utilisé" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.user.create({
      data: {
        nom,
        prenom,
        email,
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    return NextResponse.json(admin, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erreur lors de l’enregistrement.' }, { status: 500 });
  }
}