import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { parse } from 'cookie';

export function getUserFromRequest(request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const cookiesObj = parse(cookieHeader);
  const token = cookiesObj.token;

  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
}