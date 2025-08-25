import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET une dépense
export async function GET(_, { params }) {
  const depense = await prisma.depense.findUnique({
    where: { id: params.id },
    include: { employe: true, projet: true },
  })
  if (!depense) {
    return Response.json({ error: 'Dépense non trouvée' }, { status: 404 })
  }
  return Response.json(depense)
}

// Mettre à jour le statut d'une demande (admin)
export async function PUT(request, { params }) {
  const { id } = await params;
  const body = await request.json();
  const { statut } = body;

  if (!['ACCEPTE', 'REFUSE'].includes(statut)) {
    return NextResponse.json(
      { error: 'Statut invalide.' },
      { status: 400 }
    );
  }

  try {
    const depense = await prisma.depense.findUnique({
      where: { id }
    })
    const projet = await prisma.projet.findUnique({
      where: { id: depense.projetId }
    })
    const updatedDepense = await prisma.depense.update({
      where: { id },
      data: { statut },
    });

    const statutText = statut === 'ACCEPTE' ? 'acceptée' : 'refusée';

    const notificationsData = await prisma.notification.create({
      data: {
        message: `Votre dépense de ${depense.montant} pour le projet ${projet.nom} a été ${statutText}`,
        userId: depense.employeId,
        targetRole: 'USER',
      },
    });

    return NextResponse.json(updatedDepense);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la dépense.' },
      { status: 500 }
    );
  }
}

// DELETE : supprimer une dépense
export async function DELETE(_, { params }) {
  await prisma.depense.delete({
    where: { id: params.id },
  })
  return Response.json({ message: 'Dépense supprimée' })
}