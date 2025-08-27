import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * API pour récupérer le nombre de jours de congés validés par mois
 */
export async function GET() {
  try {
    // Récupérer tous les congés validés
    const result = await prisma.$queryRaw`
      SELECT
        TO_CHAR("dateDebut", 'Mon') AS mois,
        DATE_TRUNC('month', "dateDebut") AS date_mois,
        SUM(EXTRACT(DAY FROM AGE("dateFin", "dateDebut")) + 1) AS nombre
      FROM "Conge"
      WHERE statut = 'VALIDE'
      GROUP BY mois, date_mois
      ORDER BY date_mois;
    `;

    // Mapper les valeurs pour l'API
    const data = result.map(item => ({
      mois: item.mois,
      nombre: parseInt(item.nombre, 10),
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erreur API /conges/mois:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}