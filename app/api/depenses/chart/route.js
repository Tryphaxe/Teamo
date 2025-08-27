import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
	try {
		const result = await prisma.$queryRaw`
      	SELECT TO_CHAR("createdAt", 'Mon') AS mois,
    	DATE_TRUNC('month', "createdAt") AS date_mois,
        SUM(montant) AS total
      	FROM "Depense"
		WHERE statut = 'ACCEPTE'
		GROUP BY mois, date_mois
		ORDER BY date_mois;`;

		const data = result.map(item => ({
			mois: item.mois,
			montant: parseFloat(item.total),
		}));

		return NextResponse.json(data);
	} catch (error) {
		console.error('Erreur API /depenses/mois:', error);
		return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
	}
}