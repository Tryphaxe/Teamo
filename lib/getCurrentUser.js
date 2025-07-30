// lib/getCurrentUser.js
import { parse } from 'cookie';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET;

export async function getCurrentUser(req) {
  const cookieHeader = req.headers.get('cookie');
  if (!cookieHeader) return null;

  const cookies = parse(cookieHeader);
  const token = cookies.token;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    let user = null;

    if (decoded.role === 'ADMIN') {
      user = await prisma.administrateur.findUnique({ where: { id: decoded.id } });
    } else if (decoded.role === 'EMPLOYE') {
      user = await prisma.employe.findUnique({
        where: { id: decoded.id },
        include: {
          departement: true,
        }
      });
    }

    return user ? { ...user, role: decoded.role } : null;
  } catch (error) {
    return null;
  }
}