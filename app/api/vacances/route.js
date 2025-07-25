import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all vacances, POST new vacance
export async function GET() {
  try {
    const vacances = await prisma.vacance.findMany({
      orderBy: { dateDebut: 'desc' }
    })
    return NextResponse.json(vacances);
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
      dateDebut,
      dateFin,
    } = body;

    if (!nom || !dateDebut || !dateFin) {
      return NextResponse.json({ error: 'Champs requis manquants.' }, { status: 400 });
    }

    const vacance = await prisma.vacance.create({
      data: {
        nom,
        dateDebut: new Date(dateDebut),
        dateFin: new Date(dateFin)
      },
    });

    return NextResponse.json(vacance, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erreur lors de l’enregistrement.' }, { status: 500 });
  }
}