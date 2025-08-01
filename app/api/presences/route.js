import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
	const body = await req.json();
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
	const { present } = body;

	const today = new Date();
	today.setHours(0, 0, 0, 0);

	try {
		const existing = await prisma.presence.findFirst({
			where: {
				employeId,
				date: today,
			},
		});

		let updated;

		if (existing) {
			updated = await prisma.presence.update({
				where: { id: existing.id },
				data: { present },
			});
		} else {
			updated = await prisma.presence.create({
				data: {
					employeId,
					present,
					date: today,
				},
			});
		}

		return NextResponse.json(updated);
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}