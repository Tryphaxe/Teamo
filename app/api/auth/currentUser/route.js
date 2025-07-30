import { getCurrentUser } from '@/lib/getCurrentUser';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const user = await getCurrentUser(req);
  return NextResponse.json({ user });
}