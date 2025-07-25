import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

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
  const body = await req.json()
  const { titre, description, clientId } = body

  if (!titre || !clientId) {
    return Response.json({ error: 'Titre et clientId requis' }, { status: 400 })
  }

  const projet = await prisma.projet.create({
    data: {
      titre,
      description,
      clientId
    }
  })

  return Response.json(projet)
}
