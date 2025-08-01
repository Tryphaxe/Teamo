import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
	const {dateParam} = await params;

	try {
		const presences = await prisma.presence.findMany({
			where: {
				date: dateParam,
			},
			include: {
				employe: true,
			},
		});

		return NextResponse.json(presences);
	} catch (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}