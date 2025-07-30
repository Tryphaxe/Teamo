"use client"

import { useEffect, useState } from 'react';
import { Receipt, User, UserRoundPen } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image'
import Link from 'next/link';
import { Home, Bell, HandCoins, MailQuestion, TreePalm, UserCog, Loader2 } from 'lucide-react';


export default function Page() {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter()

	useEffect(() => {
		fetch('/api/auth/currentUser')
			.then(res => res.json())
			.then(data => {
				setUser(data.user);
				setLoading(false);
			});
	}, []);

	const status = 'approved';
	const emp = 1

	return (
		<div className='space-y-3'>
			{/* En-tête de bienvenue */}
			<div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
				<h1 className="text-2xl font-bold mb-2">Bonjour, {loading ? (<span className="text-sm animate-pulse">###</span>) : user ? user.nom : ' '}</h1>
				<p className="text-blue-100">Voici un aperçu de votre espace personnel</p>
			</div>

			{/* Informations personnelles */}
			<div className="bg-white rounded-xl border border-gray-200 p-6">
				<div className="flex items-center gap-4 mb-4">
					<div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
						<User className="w-8 h-8 text-blue-600" />
					</div>
					<div>
						<h2 className="text-xl font-semibold text-gray-900">{loading ? (<span className="px-10 bg-gray-200 rounded animate-pulse w-full"></span>) : user ? (user.nom + " " + user.prenom) : 'Non connecté'}</h2>
						<p className="text-gray-600">{loading ? (<span className="px-10 bg-gray-200 rounded animate-pulse w-full"></span>) : user ? user.poste : ' '}</p>
						<p className="text-sm text-gray-500">{loading ? (<span className="px-10 bg-gray-200 rounded animate-pulse w-full"></span>) : user ? user.departement.nom : ' '}</p>
						<button
							className="flex items-center mt-2 gap-2 px-4 py-2 bg-orange-500 text-white rounded-2xl hover:bg-orange-600 transition-colors"
						>
							<UserRoundPen className="w-4 h-4" />
							Modifier mon profil
						</button>
					</div>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
					<div>
						<p className="text-sm text-gray-500">Email</p>
						<p className="font-medium">{loading ? (<span className="px-10 bg-gray-200 rounded animate-pulse w-full"></span>) : user ? user.email : ' '}</p>
					</div>
					<div>
						<p className="text-sm text-gray-500">Département</p>
						<p className="font-medium">{loading ? (<span className="px-10 bg-gray-200 rounded animate-pulse w-full"></span>) : user ? user.departement.nom : ' '}</p>
					</div>
					<div>
						<p className="text-sm text-gray-500">Téléphone</p>
						<p className="font-medium">+225 {loading ? (<span className="px-10 bg-gray-200 rounded animate-pulse w-full"></span>) : user ? user.telephone : ' '}</p>
					</div>
					<div>
						<p className="text-sm text-gray-500">Adresse</p>
						<p className="font-medium">{loading ? (<span className="px-10 bg-gray-200 rounded animate-pulse w-full"></span>) : user ? user.adresse : ' '}</p>
					</div>
				</div>
			</div>

			{/* Mes dépenses */}
			<div className="bg-white rounded-xl border border-gray-200">
				<div className="p-3 border-b border-gray-200">
					<div className="flex items-center justify-between">
						<h3 className="text-lg font-semibold text-gray-900">Mes Dépenses</h3>
					</div>
				</div>

				<div className="p-6">
					{emp === 0 ? (
						<div className="text-center py-8 text-gray-500">
							<Receipt className="w-12 h-12 mx-auto mb-3 text-gray-300" />
							<p>Aucune dépense enregistrée</p>
						</div>
					) : (
						<div className="space-y-3">
							<div key="1" className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
								<div className="flex-1">
									<div className="flex items-center gap-3">
										<div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
											<Receipt className="w-5 h-5 text-orange-600" />
										</div>
										<div>
											<p className="font-medium text-gray-900">Formation React Advanced</p>
											<p className="text-sm text-gray-500">Formation • 2024-01-15</p>
										</div>
									</div>
								</div>
								<div className="text-right">
									<p className="font-semibold text-gray-900">500 000Fcfa</p>
									<span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${status === 'approved' ? 'bg-green-100 text-green-800' :
										status === 'rejected' ? 'bg-red-100 text-red-800' :
											'bg-yellow-100 text-yellow-800'
										}`}>
										{status === 'approved' ? 'Approuvé' :
											status === 'rejected' ? 'Refusé' : 'En attente'}
									</span>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
