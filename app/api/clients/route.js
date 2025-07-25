import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET : Liste des clients
export async function GET() {
  const clients = await prisma.client.findMany({
    include: {
      projets: true,
    },
  })
  return Response.json(clients)
}

// POST : Création d'un client
export async function POST(req) {
  const { nom } = await req.json()

  if (!nom) {
    return Response.json({ error: 'Nom requis' }, { status: 400 })
  }

  const nouveauClient = await prisma.client.create({
    data: {
      nom
    }
  })

  return Response.json(nouveauClient)
}
