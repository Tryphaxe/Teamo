import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET;

// Obtenir tous les congés
export async function GET() {
  try {
    const conges = await prisma.conge.findMany({
      include: { employe: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(conges);
  } catch (error) {
    console.error('Erreur lors de la récupération des congés:', error);
    return NextResponse.json({ error: 'Impossible de récupérer les congés' }, { status: 500 });
  }
}

// Créer une nouvelle demande de congé (employé)
export async function POST(req) {
  try {
    const body = await req.json();
    const { raison, dateDebut, dateFin, type } = body;

    // 1. Lire le token dans les cookies
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    if (!JWT_SECRET) throw new Error("JWT_SECRET n'est pas défini");

    // 2. Vérifier le token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return NextResponse.json({ error: 'Token invalide' }, { status: 403 });
    }

    const employeId = decoded.id;

    // 3. Créer le congé
    const conge = await prisma.conge.create({
      data: {
        raison,
        dateDebut: new Date(dateDebut),
        dateFin: new Date(dateFin),
        type,
        employeId,
      },
    });

    // 4. Récupérer l'employé
    const employe = await prisma.user.findUnique({ where: { id: employeId } });
    if (!employe) throw new Error("Employé introuvable");

    // 5. Récupérer les admins
    const admins = await prisma.user.findMany({ where: { role: 'ADMIN' } });

    // 6. Créer les notifications pour tous les admins
    if (admins.length > 0) {
      const notificationsData = admins.map(admin => ({
        userId: admin.id,
        targetRole: "ADMIN",
        message: `${employe.nom} ${employe.prenom} a fait une nouvelle demande de congé du ${new Date(dateDebut).toLocaleDateString('fr-FR')} au ${new Date(dateFin).toLocaleDateString('fr-FR')}`,
      }));

      await prisma.notification.createMany({ data: notificationsData });
    }

    return NextResponse.json({ conge, message: 'Demande de congé créée et notifications envoyées aux admins' });

  } catch (error) {
    console.error('Erreur lors de la création du congé:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la création du congé.' },
      { status: 500 }
    );
  }
}