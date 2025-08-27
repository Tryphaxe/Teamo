import { getFormattedDate } from "@/lib/date";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const depenses = await prisma.depense.findMany({
			include:{employe: true, projet: true},
			orderBy: {date: "desc"}
		});

		// Transformer les données pour l'export
		const exportData = depenses.map((emp, index) => ({
			N0: (index + 1),
			Date: getFormattedDate(emp.createdAt),
			Nom: (emp.employe.nom + " " + emp.employe.prenom),
			Projet: emp.projet.nom,
			Montant: emp.montant,
			Statut: emp.statut,
		}));

		return NextResponse.json(exportData);
	} catch (error) {
		console.error("Erreur lors de la récupération des depenses :", error);
		return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
	}
}
