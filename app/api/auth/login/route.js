import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // Recherche dans les deux tables
    const employe = await prisma.employe.findUnique({ where: { email } });
    const admin = await prisma.administrateur.findUnique({ where: { email } });

    let user = null;
    let role = null;

    if (employe && await bcrypt.compare(password, employe.password)) {
      user = employe;
      role = 'EMPLOYE';
    } else if (admin && await bcrypt.compare(password, admin.password)) {
      user = admin;
      role = 'ADMIN';
    }

    if (!user) {
      return NextResponse.json({ error: 'Identifiants invalides' }, { status: 401 });
    }

    // Génération du token JWT
    const token = jwt.sign({ id: user.id, role }, JWT_SECRET, { expiresIn: '1d' });

    // Création du cookie
    const cookie = serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 jour
      path: '/',
      sameSite: 'strict',
    });

    // Réponse avec le cookie + rôle à la racine
    const response = NextResponse.json({
      message: 'Connexion réussie',
      role, // ⬅️ Ajout du rôle ici directement
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