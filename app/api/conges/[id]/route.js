import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Voir une demande de congé
export async function GET(_, { params }) {
  const conge = await prisma.conge.findUnique({
    where: { id: params.id },
    include: { employe: true },
  });
  return NextResponse.json(conge);
}

// Mettre à jour le statut d'une demande (admin)
export async function PUT(req, { params }) {
  const body = await req.json();
  const { statut } = body;

  const updated = await prisma.conge.update({
    where: { id: params.id },
    data: { statut },
  });

  return NextResponse.json(updated);
}

// Supprimer une demande
export async function DELETE(_, { params }) {
  await prisma.conge.delete({ where: { id: params.id } });
  return NextResponse.json({ message: 'Demande supprimée' });
}
