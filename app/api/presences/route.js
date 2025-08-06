import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';
import { parseISO } from 'date-fns';

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req) {
	const { searchParams } = new URL(req.url);
	const dateStr = searchParams.get('date');

	if (!dateStr) {
		return NextResponse.json({ error: 'Date manquante' }, { status: 400 });
	}

	const date = parseISO(dateStr);
	const startOfDay = new Date(date.setHours(0, 0, 0, 0));
	const endOfDay = new Date(date.setHours(23, 59, 59, 999));

	const presences = await prisma.presence.findMany({
		where: {
			date: {
				gte: startOfDay,
				lte: endOfDay,
			},
		},
		include: {
			employe: true,
		},
	});

	const data = presences.map((p) => ({
		id: p.employe.id,
		nom: p.employe.nom,
		prenom: p.employe.prenom,
		email: p.employe.email,
		present: p.present,
		date: p.date
	}));

	return NextResponse.json(data);
}

export async function POST(req) {
	const body = await req.json();
	const { pres } = body;
	
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
	
	const now = new Date();
	const today =new Date(now.setHours(0, 0, 0, 0));

	const existing = await prisma.presence.findFirst({
		where: {
			employeId,
			date: today,
		},
	});

	if (existing) {
		return NextResponse.json({ message: 'Déjà enregistré' }, { status: 200 });
	}

	const presence = await prisma.presence.create({
		data: {
			date: today,
			present: pres,
			employeId,
		},
	});

	return NextResponse.json(presence);
}