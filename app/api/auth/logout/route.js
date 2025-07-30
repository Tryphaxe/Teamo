import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function GET() {
  const cookie = serialize('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(0),
    path: '/',
  });

  const response = NextResponse.json({ message: 'Déconnecté' });
  response.headers.set('Set-Cookie', cookie);

  return response;
}