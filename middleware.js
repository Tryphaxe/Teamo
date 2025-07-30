import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const PUBLIC_PATHS = ['/auth/login', '/api/auth/login', '/unauthorized']

// Clé secrète au format Uint8Array
const secret = new TextEncoder().encode(process.env.JWT_SECRET)

export async function middleware(request) {
	const { pathname } = request.nextUrl
	const token = request.cookies.get('token')?.value

	// Autoriser l'accès aux routes publiques
	if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
		return NextResponse.next()
	}

	try {
		if (!token) throw new Error('No token provided')

		// Vérification du token avec jose
		const { payload } = await jwtVerify(token, secret)
		const userRole = payload.role?.toUpperCase()

		if (userRole !== 'ADMIN' && userRole !== 'EMPLOYE') {
			throw new Error('Invalid role')
		}
		// Redirection si mauvais rôle
		if (userRole === 'EMPLOYE' && pathname.startsWith('/dashboard')) {
			return NextResponse.redirect(new URL('/unauthorized', request.url))
		}
		if (userRole === 'ADMIN' && pathname.startsWith('/employee')) {
			return NextResponse.redirect(new URL('/unauthorized', request.url))
		}

		// Continuer normalement
		return NextResponse.next()
	} catch (error) {
		console.error('Middleware error:', error.message)

		const loginUrl = new URL('/auth/login', request.url)
		loginUrl.searchParams.set('redirect', pathname)

		const response = NextResponse.redirect(loginUrl)
		response.cookies.delete('token')

		return response
	}

}

export const config = {
	matcher: [
		'/((?!_next/static|_next/image|favicon.ico|images|icons|fonts).*)',
	],
}