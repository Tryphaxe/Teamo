import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// Supprimer un projet
export async function DELETE(request, { params }) {
  const clientId = params.id;

  try {
    // Supprimer tous les projets liés
    await prisma.projet.deleteMany({
      where: { clientId },
    });

    // Supprimer le client
    await prisma.client.delete({
      where: { id: clientId },
    });

    return NextResponse.json({ message: 'Client et ses projets supprimés.' });
  } catch (err) {
    return NextResponse.json({ error: 'Erreur lors de la suppression.' }, { status: 500 });
  }
}