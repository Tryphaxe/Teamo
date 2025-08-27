import { getFormattedDate } from "@/lib/date";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const employes = await prisma.user.findMany({
			where: { role: "EMPLOYE" },
			include: {
				departement: true,
			},
			orderBy: {
				nom: 'asc',
			},
		});

		// Transformer les données pour l'export
		const exportData = employes.map((emp, index) => ({
			N0: (index + 1),
			Nom: emp.nom,
			Prenom: emp.prenom,
			Genre: emp.genre,
			Email: emp.email,
			Téléphone: emp.telephone,
			Département: emp.departement?.nom || "Aucun",
			Poste: emp.poste,
			DateEntree: getFormattedDate(emp.dateEntree),
			DateSortie: emp.dateSortie ? getFormattedDate(emp.dateSortie) : "#####",
		}));

		return NextResponse.json(exportData);
	} catch (error) {
		console.error("Erreur lors de la récupération des employés :", error);
		return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
	}
}
