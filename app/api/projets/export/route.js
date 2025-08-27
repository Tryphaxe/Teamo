import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const projets = await prisma.projet.findMany({
			include: {client: true},
			orderBy: {nom: "asc"}
		});

		// Transformer les données pour l'export
		const exportData = projets.map((emp, index) => ({
			N0: (index + 1),
			Libellé: emp.nom,
			NomClient: emp.client.nom
		}));

		return NextResponse.json(exportData);
	} catch (error) {
		console.error("Erreur lors de la récupération des projets :", error);
		return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
	}
}
