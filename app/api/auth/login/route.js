import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // Recherche dans la table unique User
    const user = await prisma.user.findUnique({ where: { email } });

    // Vérification si l'utilisateur existe et que le mot de passe est correct
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ error: 'Identifiants invalides' }, { status: 401 });
    }

    // Génération du token JWT avec le rôle venant de la DB
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

    // Création du cookie
    const cookie = serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 jour
      path: '/',
      sameSite: 'lax',
    });

    // Réponse avec le cookie + rôle
    const response = NextResponse.json({
      message: 'Connexion réussie',
      role: user.role,
      user: {
        id: user.id,
        nom: user.nom,
        email: user.email,
      },
    });

    response.headers.set('Set-Cookie', cookie);

    return response;

  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}