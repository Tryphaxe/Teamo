import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET : Tous les projets avec le client
export async function GET() {
  const projets = await prisma.projet.findMany({
    include: {
      client: true
    }
  })
  return Response.json(projets)
}

// POST : Création d’un projet lié à un client
export async function POST(req) {
  try {
    const body = await req.json()
    const { nom, clientId } = body

    if (!nom || !clientId) {
      return NextResponse.json({ error: 'Champs requis manquants.' }, { status: 400 });
    }

    const projet = await prisma.projet.create({
      data: {
        nom,
        clientId
      }
    })

    return NextResponse.json(projet, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erreur lors de l’enregistrement.' }, { status: 500 });
  }
}
