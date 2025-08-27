import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const clients = await prisma.client.findMany();

		// Transformer les données pour l'export
		const exportData = clients.map((emp, index) => ({
			N0: (index + 1),
			nom: emp.nom,
		}));

		return NextResponse.json(exportData);
	} catch (error) {
		console.error("Erreur lors de la récupération des clients :", error);
		return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
	}
}
