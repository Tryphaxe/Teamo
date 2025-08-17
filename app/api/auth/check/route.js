import { NextResponse } from 'next/server';
import { parse } from 'cookie';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req) {
  const cookieHeader = req.headers.get('cookie');
  if (!cookieHeader) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

  const cookies = parse(cookieHeader);
  const token = cookies.token;
  if (!token) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

  try {
    jwt.verify(token, JWT_SECRET);
    return NextResponse.json({ authenticated: true });
  } catch (err) {
    return NextResponse.json({ error: 'Session expirée' }, { status: 401 });
  }
}
