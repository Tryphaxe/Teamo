import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET : liste de tous les départements
export async function GET() {
  try {
    const departements = await prisma.departement.findMany({
      include: {
        _count: {
          select: { employes: true },
        },
      },
    });

    return NextResponse.json(departements);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erreur lors de la récupération.' }, { status: 500 });
  }
}

// POST : créer un nouveau département
export async function POST(req) {
  const { nom } = await req.json()

  if (!nom) {
    return Response.json({ error: 'Nom requis' }, { status: 400 })
  }

  const departement = await prisma.departement.create({
    data: { nom }
  })

  return Response.json(departement)
}