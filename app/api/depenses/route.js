import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// GET : liste toutes les dépenses avec employé et projet
export async function GET() {
  const depenses = await prisma.depense.findMany({
    include: {
      employe: true,
      projet: true,
    },
    orderBy: {
      date: 'desc',
    },
  })
  return Response.json(depenses)
}

// POST : créer une dépense
export async function POST(req) {
  const body = await req.json()
  const { montant, description, date, employeId, projetId } = body

  if (!montant || !employeId) {
    return Response.json({ error: 'Montant et employeId requis' }, { status: 400 })
  }

  const depense = await prisma.depense.create({
    data: {
      montant,
      description,
      date: date ? new Date(date) : undefined,
      employeId,
      projetId,
    },
  })

  return Response.json(depense)
}