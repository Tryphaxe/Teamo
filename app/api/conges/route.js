import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Obtenir tous les congés
export async function GET() {
  const conges = await prisma.conge.findMany({
    include: { employe: true },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(conges);
}

// Créer une nouvelle demande de congé (employé)
export async function POST(req) {
  const body = await req.json();
  const { motif, dateDebut, dateFin, employeId } = body;

  const conge = await prisma.conge.create({
    data: {
      motif,
      dateDebut: new Date(dateDebut),
      dateFin: new Date(dateFin),
      employeId,
    },
  });

  return NextResponse.json(conge);
}
