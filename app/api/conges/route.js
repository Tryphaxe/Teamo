import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET;

// Obtenir tous les congés
export async function GET() {
  const conges = await prisma.conge.findMany({
    include: { employe: true },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(conges);
}

// Créer une nouvelle demande de congé (employé)
export async function POST(req) {
  const body = await req.json();
  const { raison, dateDebut, dateFin, type } = body;

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

  const conge = await prisma.conge.create({
    data: {
      raison,
      dateDebut: new Date(dateDebut),
      dateFin: new Date(dateFin),
      type,
      employeId,
    },
  });

  return NextResponse.json(conge);
}
