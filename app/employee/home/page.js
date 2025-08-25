"use client"

import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Calendar, Check, Info, Loader2, Radius, Receipt, RefreshCw, User, UserRoundPen, X } from 'lucide-react';
import { formatDate, getFormattedDate } from '@/lib/date';
import { checkPresence, submitPresence } from '@/lib/api/apiPresence';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, TransitionChild } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

export default function Page() {
	const [user, setUser] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [loading, setLoading] = useState(true);
	const today = new Date();
	const todayStr = getFormattedDate(today);
	const [stat, setStat] = useState(undefined);
	const [openDra, setOpenDra] = useState(false);

	const fetchData = useCallback(async () => {
		const result = await checkPresence(todayStr);
		setStat(result);
	}, [todayStr]);

	useEffect(() => {
		fetch('/api/auth/currentUser')
			.then(res => res.json())
			.then(data => {
				setUser(data.user);
				setLoading(false);
			});
		fetchData();
	}, [fetchData]);

	const handleSubmit = async (present) => {
		setIsLoading(true);
		const toastt = toast.loading("Validation en cours...");
		try {
			await submitPresence(present);
			fetchData();
			toast.success(`Vous êtes noté : ${present === true ? "Présent" : "Absent"}`, { id: toastt });
		} catch (error) {
			toast.error("Erreur lors de la soumission de la présence...", { id: toastt });
			console.error('Erreur lors de la soumission de la présence :', error);
		} finally {
			setIsLoading(false);
		}
	};

	const [form, setForm] = useState({
		email: '',
		password: '',
		nom: '',
		prenom: '',
		telephone: '',
		adresse: '',
	});
	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};
	// Fonction pour enregistrer un nouvel employé
	const handleSubmitUpdate = async (e) => {
		e.preventDefault();
		setLoading(true);
		const toastttt = toast.loading("Modification en cours...");

		try {
			const res = await fetch(`/api/employes/${user.id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					...form,
					password: form.password !== '' ? form.password : undefined,
				}),
			});

			const data = await res.json();

			if (!res.ok) {
				toast.error(data.error || "Erreur lors de l'enregistrement", { id: toastttt });
				return;
			}
			toast.success("Modification réussie !", { id: toastttt });
			setOpenDra(false);
		} catch (err) {
			console.error(err);
			toast.error('Erreur lors de la modification.', { id: toastttt });
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='space-y-3'>
			{/* En-tête de bienvenue */}
			<div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
				<h1 className="text-2xl font-bold mb-2">Bonjour, {loading ? (<span className="px-10 ml-2 bg-blue-200 rounded-full animate-pulse w-full"></span>) : user ? user.nom : ' '}</h1>
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
							onClick={() => {
								setOpenDra(true);
								setForm({
									nom: user.nom || '',
									prenom: user.prenom || '',
									email: user.email || '',
									password: '', // vide par défaut
									telephone: user.telephone || '',
									adresse: user.adresse || '',
								});

							}}
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
						<p className="font-medium">+225&nbsp;{loading ? (<span className="px-10 bg-gray-200 rounded animate-pulse w-full"></span>) : user ? user.telephone : ' '}</p>
					</div>
					<div>
						<p className="text-sm text-gray-500">Adresse</p>
						<p className="font-medium">{loading ? (<span className="px-10 bg-gray-200 rounded animate-pulse w-full"></span>) : user ? user.adresse : ' '}</p>
					</div>
				</div>
				<div className="mt-3">
					<div className='w-full bg-gray-50 p-2 rounded-md'>Mes documents</div>
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
						{/* Bloc : Fichiers joints */}
						<div>
							{user?.files?.length > 0 ? (
								<ul className="space-y-2">
									{user?.files.map((file, index) => (
										<li key={index} className="flex justify-between items-center bg-gray-100 p-2 rounded-md">
											<span className="truncate">{file.name}</span>
											<a
												href={file.url}
												target="_blank"
												rel="noopener noreferrer"
												className="text-gray-800"
												download
											>
												<Eye size={20} />
											</a>
										</li>
									))}
								</ul>
							) : (
								<p className="text-gray-500 text-sm">Aucun document disponible !</p>
							)}
						</div>
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
								Vous avez marqué votre présence comme&nbsp; <b>Présent</b>&nbsp;!
							</span>
						) : stat === false ? (
							<span className="w-full h-6 inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-sm font-medium text-red-700 ring-1 ring-red-600/10 ring-inset">
								Vous avez marqué votre présence comme&nbsp; <b>Absent</b>&nbsp;!
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


			<div className='z-50'>
				<Dialog open={openDra} onClose={setOpenDra} className="relative z-50">
					<DialogBackdrop
						transition
						className="fixed inset-0 bg-gray-500/75 transition-opacity duration-500 ease-in-out data-closed:opacity-0"
					/>

					<div className="fixed inset-0 overflow-hidden">
						<div className="absolute inset-0 overflow-hidden">
							<div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
								<DialogPanel
									transition
									className="pointer-events-auto relative w-screen max-w-md transform transition duration-500 ease-in-out data-closed:translate-x-full sm:duration-700"
								>
									<TransitionChild>
										<div className="absolute top-0 left-0 -ml-8 flex pt-4 pr-2 duration-500 ease-in-out data-closed:opacity-0 sm:-ml-10 sm:pr-4">
											<button
												type="button"
												onClick={() => setOpenDra(false)}
												className="relative rounded-md text-gray-300 hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-hidden cursor-pointer"
											>
												<span className="absolute -inset-2.5" />
												<span className="sr-only">Close panel</span>
												<XMarkIcon aria-hidden="true" className="size-6" />
											</button>
										</div>
									</TransitionChild>
									<div className="flex h-full flex-col overflow-y-auto bg-white py-6 shadow-xl">
										<div className="px-4 sm:px-6">
											<DialogTitle className="text-xl font-semibold text-gray-900">
												<div className="flex items-center">
													<span className="Text-xl">Modifier mon profil</span>
												</div>
											</DialogTitle>
										</div>
										<div className="relative mt-6 flex-1 px-4 sm:px-6">
											<form onSubmit={handleSubmitUpdate}>
												<div className=" grid grid-cols-1 space-y-2">
													<div className="bg-orange-100 p-1 my-4 border-b border-gray-200 text-orange-600 text-xl">
														<span className='uppercase'>Informations personnelles</span>
													</div>
													<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
														<div>
															<label className="block text-sm font-medium text-black mb-1">
																Nom
															</label>
															<input
																name="nom"
																value={form.nom} onChange={handleChange}
																type="text"
																className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"

															/>
														</div>
														<div>
															<label className="block text-sm font-medium text-black mb-1">
																Prénom(s)
															</label>
															<input
																name="prenom"
																value={form.prenom} onChange={handleChange}
																type="text"
																className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"

															/>
														</div>
														<div>
															<label className="block text-sm font-medium text-black mb-1">
																Téléphone
															</label>
															<input
																name="telephone"
																value={form.telephone} onChange={handleChange}
																type="text"
																className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"

															/>
														</div>
														<div>
															<label className="block text-sm font-medium text-black mb-1">
																Adresse
															</label>
															<input
																name="adresse"
																value={form.adresse} onChange={handleChange}
																type="text"
																className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"

															/>
														</div>
													</div>
													<div className="bg-orange-100 p-1 my-4 border-b border-gray-200 mb-4 text-orange-600 text-xl">
														<span className='uppercase'>Informations de connexion</span>
													</div>
													<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
														<div>
															<label className="block text-sm font-medium text-black mb-1">
																Email
															</label>
															<input
																name="email"
																type="email"
																value={form.email} onChange={handleChange}
																className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"

															/>
														</div>
														<div>
															<label className="block text-sm font-medium text-black mb-1">
																Mot de passe
															</label>
															<input
																name="password"
																value={form.password} onChange={handleChange}
																type="password"
																className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"

															/>
														</div>
													</div>
													<div className="flex gap-2 mt-3">
														<button
															type="submit"
															className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
														>
															{loading ? (
																<Loader2 className="animate-spin h-5 w-5" />
															) : 'Valider'}
														</button>
														<button
															type="button"
															className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400 transition-colors"
															onClick={() => setOpenDra(false)}
														>
															Annuler la modification
														</button>
													</div>
												</div>
											</form>
										</div>
									</div>
								</DialogPanel>
							</div>
						</div>
					</div>
				</Dialog>
			</div>
		</div>
	)
}
