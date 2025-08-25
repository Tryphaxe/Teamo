'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { Eye, EyeOff, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import axios from 'axios';

// --- Composant client pour checker la session ---
function SessionChecker() {
	const searchParams = useSearchParams();

	useEffect(() => {
		if (searchParams.get('session') === 'expired') {
			toast.error("Votre session a expiré. Merci de vous reconnecter.");
		}
	}, [searchParams]);

	return null;
}

// --- Formulaire de connexion ---
function LoginForm() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		const toastId = toast.loading("Connexion en cours...");
		try {
			const res = await axios.post('/api/auth/login', { email, password });
			if (res.status === 200 && res.data?.role) {
				const role = res.data.role;
				if (role === 'ADMIN') router.push('/dashboard/home');
				else if (role === 'EMPLOYE') router.push('/employee/home');
				else toast.error('Rôle inconnu', { id: toastId });
			} else {
				toast.error('Échec de la connexion.', { id: toastId });
			}
			toast.success('Connexion réussie !', { id: toastId });
		} catch (err) {
			toast.error('Échec de la connexion.', { id: toastId });
			setError("Email ou mot de passe incorrect");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="bg-white rounded-2xl border border-gray-100 p-8">
			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Email */}
				<div>
					<label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
						Adresse email
					</label>
					<div className="relative">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<Mail className="h-5 w-5 text-gray-400" />
						</div>
						<input
							id="email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
							placeholder="votre@email.com"
							required
						/>
					</div>
				</div>

				{/* Mot de passe */}
				<div>
					<label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
						Mot de passe
					</label>
					<div className="relative">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<Lock className="h-5 w-5 text-gray-400" />
						</div>
						<input
							id="password"
							type={showPassword ? 'text' : 'password'}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
							placeholder="••••••••"
							required
						/>
						<button
							type="button"
							onClick={() => setShowPassword(!showPassword)}
							className="absolute inset-y-0 right-0 pr-3 flex items-center"
						>
							{showPassword ? (
								<EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
							) : (
								<Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
							)}
						</button>
					</div>
				</div>

				{/* Message d'erreur */}
				{error && (
					<div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
						<AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
						<p className="text-sm text-red-700">{error}</p>
					</div>
				)}

				{/* Bouton de connexion */}
				<button
					type="submit"
					disabled={loading}
					className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{loading ? (
						<>
							<Loader2 className="h-4 w-4 animate-spin" />
							Connexion en cours...
						</>
					) : (
						'Se connecter'
					)}
				</button>
			</form>
		</div>
	);
}

// --- Page principale ---
export default function LoginPageWrapper() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center p-4">
			<div className="w-full max-w-md">
				{/* Logo et titre */}
				<div className="text-center mb-8">
					<div className="flex justify-center mb-4">
						<Image src="/images/timo.png" alt="Teamo Logo" width={60} height={60} className="w-auto h-8"
							priority
							unoptimized />
					</div>
					<h1 className="text-2xl font-bold text-gray-900 mb-2">Connexion à Teamo</h1>
					<p className="text-gray-600">Accédez à votre espace de gestion</p>
				</div>

				{/* Suspense pour session checker */}
				<Suspense fallback={null}>
					<SessionChecker />
				</Suspense>

				{/* Formulaire */}
				<LoginForm />

				{/* Footer */}
				<div className="mt-8 text-center">
					<p className="text-xs text-gray-500">
						© 2025 Teamo. Tous droits réservés.
					</p>
				</div>
			</div>
		</div>
	);
}