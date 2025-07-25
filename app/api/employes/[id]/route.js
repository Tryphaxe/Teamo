import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(_, { params }) {
  const employe = await prisma.employe.findUnique({
    where: { id: params.id },
  });
  return NextResponse.json(employe);
}

export async function PUT(req, { params }) {
  const { id } = await params;
  const data = await req.json();

  try {
    const employe = await prisma.employe.update({
      where: { id: parseInt(id) },
      data,
    });
    return NextResponse.json(employe);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const id = parseInt(params.id);

  try {
    await prisma.employe.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Delete success" }, { status: 200 });
  } catch (error) {
    console.error("Erreur suppression : ", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}