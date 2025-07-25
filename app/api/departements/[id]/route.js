import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// Supprimer un département
export async function DELETE(request, { params }) {
  const id = parseInt(params.id);

  try {
    await prisma.departement.delete({
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