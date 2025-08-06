import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';
import { parseISO } from 'date-fns';

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req) {
	const { searchParams } = new URL(req.url);
	const dateStr = searchParams.get('date');
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

	const date = parseISO(dateStr);
	const dateZ = new Date(date.setHours(0, 0, 0, 0));

	const presence = await prisma.presence.findFirst({
		where: {
			employeId,
			date: dateZ,
		},
	});

	if (!presence) return NextResponse.json({ present: undefined });

	return NextResponse.json({ present: presence.present });
}