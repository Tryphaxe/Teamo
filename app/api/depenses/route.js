import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';
import { createClient } from '@/lib/supabase';

const JWT_SECRET = process.env.JWT_SECRET;

// GET : liste toutes les dépenses avec employé et projet
export async function GET() {
  const depenses = await prisma.depense.findMany({
    include: {
      employe: true,
      fichiers: true,
      projet: {
        include: {
          client: true,
        },
      }
    },
    orderBy: {
      date: 'desc',
    },
  })
  return Response.json(depenses)
}

// POST : créer une dépense
export async function POST(req) {
  const body = await req.json();
  const { montant, description, projetId, date, justificatifUrl, justificatifName } = body;

  // 1. Lire le token dans les cookies
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  let decoded;
  try {
    // 2. Vérifier le token
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return NextResponse.json({ error: 'Token invalide' }, { status: 403 });
  }

  const employeId = decoded.id;

  // 3. Validation des champs
  if (!montant) {
    return NextResponse.json({ error: 'Montant requis' }, { status: 400 });
  }

  // 4. Création de la dépense
  const depense = await prisma.depense.create({
    data: {
      montant: parseFloat(montant),
      description,
      employeId,
      projetId
    },
  });

  if (justificatifUrl && justificatifName) {
    await prisma.depenseFile.create({
      data: {
        name: justificatifName,
        url: justificatifUrl,
        depenseId: depense.id,
      },
    });
  }

  // 4. Récupérer l'employé
  const employe = await prisma.user.findUnique({ where: { id: employeId } });
  if (!employe) throw new Error("Employé introuvable");

  // 4. Récupérer l'employé
  const projet = await prisma.projet.findUnique({ where: { id: projetId } });
  if (!projet) throw new Error("Projet introuvable");

  // Création de la notification
  const notificationsData = await prisma.notification.create({
    data: {
      message: `${employe.nom + ' ' + employe.prenom} a fait une demande de dépense de ${montant}FCFA pour le projet ${projet.nom}.`,
      userId: employeId,
      targetRole: 'ADMIN',
    },
  });

  return NextResponse.json(depense);
}