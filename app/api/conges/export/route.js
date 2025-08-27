import { getFormattedDate } from "@/lib/date";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const conges = await prisma.conge.findMany({
			include:{employe: true},
			orderBy: {createdAt: "desc"}
		});

		// Transformer les données pour l'export
		const exportData = conges.map((emp, index) => ({
			N0: (index + 1),
			Nom_Employe: (emp.employe.nom + " " + emp.employe.prenom),
			Type: emp.type,
			Date_Debut: getFormattedDate(emp.dateDebut),
			Date_Fin: getFormattedDate(emp.dateFin),
			Statut: emp.statut,
		}));

		return NextResponse.json(exportData);
	} catch (error) {
		console.error("Erreur lors de la récupération des conges :", error);
		return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
	}
}
