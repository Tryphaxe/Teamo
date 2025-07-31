import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET;

// GET : liste toutes les dépenses avec employé et projet
export async function GET() {
  const depenses = await prisma.depense.findMany({
    include: {
      employe: true,
      projet: {
        include: {
          client: true,
        },
      }
    },
    orderBy: {
      date: 'desc',
    },
  })
  return Response.json(depenses)
}

// POST : créer une dépense
export async function POST(req) {
  const body = await req.json();
  const { montant, description, projetId } = body;

  // 1. Lire le token dans les cookies
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  let decoded;
  try {
    // 2. Vérifier le token
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return NextResponse.json({ error: 'Token invalide' }, { status: 403 });
  }

  const employeId = decoded.id;

  // 3. Validation des champs
  if (!montant) {
    return NextResponse.json({ error: 'Montant requis' }, { status: 400 });
  }

  // 4. Création de la dépense
  const depense = await prisma.depense.create({
    data: {
      montant: parseFloat(montant),
      description,
      employeId,
      projetId: projetId ? parseInt(projetId) : null,
    },
  });

  return NextResponse.json(depense);
}