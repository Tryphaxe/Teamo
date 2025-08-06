"use client"

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Calendar, Check, Loader2, Receipt, User, UserRoundPen, X } from 'lucide-react';
import { formatDate, getFormattedDate } from '@/lib/date';
import { checkPresence, submitPresence } from '@/lib/api/apiPresence';


export default function Page() {
	const [user, setUser] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [loading, setLoading] = useState(true);
	const today = new Date();
	const todayStr = getFormattedDate(today);
	const [stat, setStat] = useState(undefined);

	useEffect(() => {
		const fetchData = async () => {
			const result = await checkPresence(todayStr);
			setStat(result);
		};

		fetchData();
	}, [todayStr]);

	const handleSubmit = async (present) => {
		setIsLoading(true);
		const toastId = toast.loading("Validation en cours...");
		try {
			await submitPresence(present);
			toast.success(`Vous êtes noté : ${present}`, { id: toastId });
		} catch (error) {
			toast.error("Erreur lors de la soumission de la présence...", { id: toastId });
			console.error('Erreur lors de la soumission de la présence :', error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetch('/api/auth/currentUser')
			.then(res => res.json())
			.then(data => {
				setUser(data.user);
				setLoading(false);
			});
	}, []);

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

			<div className="bg-white rounded-xl border border-gray-200">
				<div className="p-3 border-b border-gray-200">
					<div className="flex items-center justify-between">
						<h3 className="text-lg font-semibold text-gray-900">Notifier sa présence</h3>
					</div>
				</div>

				<div className="p-3 space-y-3">
					<div className='w-full flex items-center'>
						{loading ? (
							<span className="px-10 bg-gray-200 rounded animate-pulse w-full h-6"></span>
						) : stat === true ? (
							<span className="w-full h-6 inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-sm font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset">
								Vous avez marqué votre présence  "Présent" !
							</span>
						) : stat === false ? (
							<span className="w-full h-6 inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-sm font-medium text-red-700 ring-1 ring-red-600/10 ring-inset">
								Vous avez marqué votre présence  "Absent" !
							</span>
						) : (
							<span className="w-full h-6 inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-sm font-medium text-gray-600 ring-1 ring-gray-500/10 ring-inset">
								Vous n’avez pas encore marqué votre présence.
							</span>
						)}
					</div>

					<div className="flex items-center justify-between">
						<div className='flex items-center gap-x-2 text-orange-500 text-lg sm:text-2xl font-bold'>
							<Calendar className='text-orange-900 w-4 h-4' />
							<p>{formatDate(todayStr)}</p>
						</div>
						<form className="flex items-center justify-between sm:justify-end gap-x-2">
							<button
								type="button"
								onClick={() => handleSubmit(true)}
								disabled={stat !== undefined}
								className={`flex items-center text-md gap-1 px-3 py-1 rounded-lg transition-colors ${stat !== undefined
										? 'bg-gray-200 text-gray-500 cursor-not-allowed'
										: 'bg-green-100 text-green-700 hover:bg-green-200'
									}`}
							>
								<Check className="w-5 h-5" />
								Présent
							</button>

							<button
								type="button"
								onClick={() => handleSubmit(false)}
								disabled={stat !== undefined}
								className={`flex items-center text-md gap-1 px-3 py-1 rounded-lg transition-colors ${stat !== undefined
										? 'bg-gray-200 text-gray-500 cursor-not-allowed'
										: 'bg-red-100 text-red-700 hover:bg-red-200'
									}`}
							>
								<X className="w-5 h-5" />
								Absent
							</button>

						</form>
					</div>
				</div>
			</div>
		</div>
	)
}
