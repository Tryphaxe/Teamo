import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  const { id } = await params;
  const body = await request.json();

  try {
    await prisma.user.update({
      where: { id },
      data: {
        archived: body.archived,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur API archive :", error);
    return NextResponse.json({ error: "Erreur de mise à jour." }, { status: 500 });
  }
}
