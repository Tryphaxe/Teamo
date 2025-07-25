import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

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

// PUT : modifier une dépense
export async function PUT(req, { params }) {
  const body = await req.json()
  const { montant, description, date, employeId, projetId } = body

  const updated = await prisma.depense.update({
    where: { id: params.id },
    data: {
      montant,
      description,
      date: date ? new Date(date) : undefined,
      employeId,
      projetId,
    },
  })

  return Response.json(updated)
}

// DELETE : supprimer une dépense
export async function DELETE(_, { params }) {
  await prisma.depense.delete({
    where: { id: params.id },
  })
  return Response.json({ message: 'Dépense supprimée' })
}