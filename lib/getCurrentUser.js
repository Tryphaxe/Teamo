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

    // On inclut le département seulement si c’est un employé
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: decoded.role === 'EMPLOYE'
        ? { departement: true, files:true  }
        : {}
    });

    return user ? { ...user, role: decoded.role } : null;
  } catch (error) {
    return null;
  }
}