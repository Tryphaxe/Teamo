"use client"

import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import Image from 'next/image';

export default function LoginPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	// const handleSubmit = async (e) => {
	// 	e.preventDefault();
	// 	setError('');
	// 	setIsLoading(true);

	// 	try {
	// 		const success = await login(email, password);
	// 		if (!success) {
	// 			setError('Email ou mot de passe incorrect');
	// 		}
	// 	} catch (err) {
	// 		setError('Une erreur est survenue lors de la connexion');
	// 	} finally {
	// 		setIsLoading(false);
	// 	}
	// };

	// const fillDemoCredentials = (role: 'admin' | 'employee') => {
	// 	if (role === 'admin') {
	// 		setEmail('marie@timo.com');
	// 		setPassword('admin123');
	// 	} else {
	// 		setEmail('jean@timo.com');
	// 		setPassword('employee123');
	// 	}
	// };

	return (
		<div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-orange-50 flex items-center justify-center p-4">
			<div className="w-full max-w-md">
				{/* Logo et titre */}
				<div className="text-center mb-8">
					<div className="flex justify-center mb-4">
						<div className="flex items-center gap-3 ">
							<Image src="/timo.png" alt="Teamo Logo" width={16} height={16} className="w-8 h-8 object-contain" />
						</div>
					</div>
					<h1 className="text-2xl font-bold text-gray-900 mb-2">Connexion à Timo</h1>
					<p className="text-gray-600">Accédez à votre espace de gestion</p>
				</div>

				{/* Formulaire de connexion */}
				<div className="bg-white rounded-2xl border border-gray-100 p-8">
					<form className="space-y-6">
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
									// value={email}
									// onChange={(e) => setEmail(e.target.value)}
									className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
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
									// value={password}
									// onChange={(e) => setPassword(e.target.value)}
									className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
									placeholder="••••••••"
									required
								/>
								<button
									type="button"
									// onClick={() => setShowPassword(!showPassword)}
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
						{/* {error && (
							<div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
								<AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
								<p className="text-sm text-red-700">{error}</p>
							</div>
						)} */}

						{/* Bouton de connexion */}
						<button
							type="submit"
							disabled={isLoading}
							className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-medium rounded-lg hover:from-teal-600 hover:to-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isLoading ? (
								<>
									<Loader2 className="h-4 w-4 animate-spin" />
									Connexion en cours...
								</>
							) : (
								'Se connecter'
							)}
						</button>
					</form>

					{/* Comptes de démonstration */}
					{/* <div className="mt-8 pt-6 border-t border-gray-200">
						<p className="text-sm text-gray-600 text-center mb-4">Comptes de démonstration :</p>
						<div className="grid grid-cols-2 gap-3">
							<button
								onClick={() => fillDemoCredentials('admin')}
								className="p-3 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors"
							>
								<div className="text-sm font-medium text-orange-700">Administrateur</div>
								<div className="text-xs text-orange-600">marie@timo.com</div>
							</button>
							<button
								onClick={() => fillDemoCredentials('employee')}
								className="p-3 bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100 transition-colors"
							>
								<div className="text-sm font-medium text-teal-700">Employé</div>
								<div className="text-xs text-teal-600">jean@timo.com</div>
							</button>
						</div>
					</div> */}

					{/* Lien d'inscription */}
					<div className="mt-6 text-center">
						<p className="text-sm text-gray-600">
							Pas encore de compte ?{' '}
							<a href="#" className="font-medium text-teal-600 hover:text-teal-500 transition-colors">
								Contactez votre administrateur
							</a>
						</p>
					</div>
				</div>

				{/* Footer */}
				<div className="mt-8 text-center">
					<p className="text-xs text-gray-500">
						© 2025 Timo. Tous droits réservés.
					</p>
				</div>
			</div>
		</div>
	);
};