import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Voir une demande de congé
export async function GET(_, { params }) {
  const conge = await prisma.conge.findUnique({
    where: { id: params.id },
    include: { employe: true },
  });
  return NextResponse.json(conge);
}

// Mettre à jour le statut d'une demande (admin)
export async function PUT(request, { params }) {
	const { id } = await params;
	const body = await request.json();
	const { statut } = body;

	if (!['VALIDE', 'REFUSE'].includes(statut)) {
		return NextResponse.json(
			{ error: 'Statut invalide.' },
			{ status: 400 }
		);
	}

	try {
		const updatedConge = await prisma.conge.update({
			where: { id: parseInt(id) },
			data: { statut },
		});

		return NextResponse.json(updatedConge);
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: 'Erreur lors de la mise à jour du congé.' },
			{ status: 500 }
		);
	}
}

// Supprimer une demande
export async function DELETE(_, { params }) {
  await prisma.conge.delete({ where: { id: params.id } });
  return NextResponse.json({ message: 'Demande supprimée' });
}
