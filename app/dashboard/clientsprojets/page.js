"use client";

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { FolderPlus, Info, Plus, Radius, Search, Trash2, UserPlus, X } from 'lucide-react'

export default function Page() {
	const [showClientForm, setShowClientForm] = useState(false);
	const [showProjetForm, setShowProjetForm] = useState(false);
	const [nom, setNom] = useState('')
	const [loading, setLoading] = useState(false)
	const [clients, setClients] = useState([])
	const [projets, setProjets] = useState([])
	const [isloading, setIsLoading] = useState(true)
	const [searchTerm, setSearchTerm] = useState('');

	const [form, setForm] = useState({
		nom: '',
		clientId: '',
	});
	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	// Fonction pour récupérer la liste des clients
	const fetchClients = async () => {
		try {
			const res = await axios.get('/api/clients')
			setClients(res.data)
		} catch (error) {
			toast.error('Erreur lors du chargement des clients.')
		} finally {
			setIsLoading(false)
		}
	}
	// Fonction pour récupérer la liste des projets
	// const fetchProjets = async () => {
	// 	try {
	// 		const res = await axios.get('/api/projets')
	// 		setProjets(res.data)
	// 	} catch (error) {
	// 		toast.error('Erreur lors du chargement des projets.')
	// 	} finally {
	// 		setIsLoading(false)
	// 	}
	// }
	useEffect(() => {
		fetchClients()
		// fetchProjets()
	}, [])

	// Handler pour soumettre le formulaire client
	const handleClientSubmit = async (e) => {
		e.preventDefault()
		setLoading(true)

		const toastId = toast.loading('Ajout du client...')

		try {
			const res = await axios.post('/api/clients', { nom })

			toast.success(`Client "${res.data.nom}" ajouté avec succès.`, { id: toastId })
			setNom('')
		} catch (error) {
			const msg = error.response?.data?.error || 'Erreur inconnue'
			toast.error(msg, { id: toastId })
		} finally {
			setLoading(false)
			setShowClientForm(false)
			fetchClients() // Recharger la liste des clients
		}
	}

	// Handler pour soumettre le formulaire projet
	const handleProjetSubmit = async (e) => {
		e.preventDefault()
		setLoading(true)
		const toastId = toast.loading('Ajout du projet...')
		try {
			const res = await fetch('/api/projets', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(form),
			});
			const data = await res.json();

			if (!res.ok) {
				toast.error(data.error || "Erreur lors de l'enregistrement", { id: toastId });
				return;
			}
			toast.success(
				`Projet - ${data.nom} - ajouté avec succès.`,
				{ id: toastId }
			);

			setShowProjetForm(false);
			fetchClients();
		} catch (err) {
			toast.error('Erreur lors de l\'enregistrement.', { id: toastId })
		} finally {
			setLoading(false)
		}
	}

	// Handler pour supprimer un projet
	const handleDeleteProjet = async (id) => {
		if (!confirm("Voulez-vous vraiment supprimer ce projet ?")) return;
		const toastId = toast.loading('Suppression en cours...')
		try {
			await axios.delete(`/api/projets/${id}`)
			toast.success('Projet supprimé.', { id: toastId })
			fetchClients() // Recharger la liste des employés
		} catch (error) {
			toast.error('Erreur lors de la suppression.', { id: toastId })
		}
	};

	// Handler pour supprimer un client
	const handleDeleteClient = async (id) => {
		if (!confirm("Vous allez supprimer ce client et tous ses projets ?")) return;
		const toastId = toast.loading('Suppression en cours...')
		try {
			await axios.delete(`/api/clients/${id}`)
			toast.success("Client supprimé avec ses projets.", { id: toastId });
			fetchClients();
		} catch (error) {
			toast.error("Erreur lors de la suppression.", { id: toastId });
		}
	};

	const formatDate = (dateStr) => {
		if (!dateStr) return '';
		const date = new Date(dateStr);
		return date.toLocaleDateString('fr-FR');
	};

	const filteredClients = clients.filter((client) =>
		client.nom.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<div>
			{showClientForm && (
				<div className="animate-all bg-white rounded-xl border border-gray-200 p-6 mb-2">
					<h3 className="text-lg font-semibold text-gray-900 mb-4">
						Nouveau client
					</h3>
					<form onSubmit={handleClientSubmit} className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label htmlFor='nom' className="block text-sm font-medium text-gray-700 mb-1">
									Nom du client
								</label>
								<input
									type="text"
									id="nom"
									name="nom"
									value={nom}
									onChange={(e) => setNom(e.target.value)}
									className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
									required
								/>
							</div>
						</div>
						<div className="flex gap-2">
							<button
								type="submit"
								disabled={loading}
								className="cursor-pointer px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
							>
								{loading ? 'Ajout en cours...' : 'Ajouter'}
							</button>
							<button
								type="button"
								onClick={() => setShowClientForm(false)}
								className="cursor-pointer px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
							>
								Annuler
							</button>
						</div>
					</form>
				</div>
			)}
			{showProjetForm && (
				<div className="animate-all bg-white rounded-xl border border-gray-200 p-6 mb-2">
					<h3 className="text-lg font-semibold text-gray-900 mb-4">
						Nouveau projet
					</h3>
					<form onSubmit={handleProjetSubmit} className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label htmlFor='nompro' className="block text-sm font-medium text-gray-700 mb-1">
									Nom du projet
								</label>
								<input
									type="text"
									id="nompro"
									name="nom"
									value={form.nom} onChange={handleChange}
									className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
									required
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-black mb-1">
									Client associé
								</label>
								<select
									name="clientId"
									value={form.clientId} onChange={handleChange}
									className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
									required
								>
									<option value="">Sélectionner un client</option>
									{clients.map(client => (
										<option key={client.id} value={client.id}>{client.nom}</option>
									))}
								</select>
							</div>
						</div>
						<div className="flex gap-2">
							<button
								type="submit"
								disabled={loading}
								className="cursor-pointer px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
							>
								{loading ? 'Ajout en cours...' : 'Ajouter'}
							</button>
							<button
								type="button"
								onClick={() => setShowProjetForm(false)}
								className="cursor-pointer px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
							>
								Annuler
							</button>
						</div>
					</form>
				</div>
			)}
			<div className="flex items-center justify-between mb-4">
				<h1 className="text-2xl font-bold text-gray-900">Gestion des clients et projets</h1>
				{/* Champ de recherche */}
				<div className="bg-white rounded-md border border-gray-300 flex items-center gap-x-2 p-2 overflow-hidden min-w-64">
					<Search size={15} color="gray" />
					<input
						type="text"
						placeholder="Rechercher"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="bg-transparent border-none outline-none ring-0 focus:ring-0 focus:border-none focus:outline-none"
					/>
				</div>
				<div className="flex items-center gap-2">
					<button
						onClick={() => setShowClientForm(true)}
						className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
					>
						<UserPlus className="w-4 h-4" />
						Client
					</button>
					<button
						onClick={() => setShowProjetForm(true)}
						className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
					>
						<FolderPlus className="w-4 h-4" />
						Projet
					</button>
				</div>
			</div>

			<div className="">
				{/* Liste des clients */}
				<div className="bg-white rounded-xl border border-gray-200">
					<div className="p-6 border-b border-gray-200">
						<h3 className="text-lg font-semibold text-gray-900">Clients et projets</h3>
					</div>
					<div className="p-6">
						<div className="">
							{isloading ? (
								<div className="flex items-center justify-center gap-1 p-3">
									<Radius className='animate-spin w-4 h-4 text-teal-950' />
									<span className="ml-2 text-gray-700">Chargement...</span>
								</div>
							) : clients.length === 0 ? (
								<div className='flex flex-col items-center justify-center gap-3 p-3'>
									<div className="flex items-center justify-center gap-2">
										<Info className='w-4 h-4 text-red-800' />
										<span className="ml-2 text-gray-700">Aucun client trouvé !</span>
									</div>
								</div>
							) : (
								<ul className="space-y-2">
									{filteredClients.map((client) => (
										<li key={client.id} className="transition-all">
											<details className="bg-gray-50 p-3 rounded-lg">
												<summary className="cursor-pointer font-semibold flex items-center justify-between">
													<div>📁 {client.nom}</div>
													<button
														onClick={() => handleDeleteClient(client.id)}
														className="flex items-center gap-2 cursor-pointer px-2 py-2 bg-red-50 text-black rounded-lg hover:bg-red-700 hover:text-white transition-colors"
													>
														<Trash2 className="w-4 h-4" />
													</button>
												</summary>
												<ul className="pl-6 mt-2 space-y-3 border-l border-blue-900">
													{client.projets && client.projets.length > 0 ? (
														client.projets.map((projet) => (
															<li key={projet.id} className="flex items-center justify-between">
																<div className='flex flex-col gap-1'>
																	<span>📄Projet : {projet.nom}</span>
																	<span className="italic text-sm text-gray-600">Crée le {formatDate(projet.createdAt)}</span>
																</div>

																<button
																	onClick={() => handleDeleteProjet(projet.id)}
																	className="flex items-center gap-2 cursor-pointer px-2 py-2 bg-red-50 text-red-800 rounded-lg hover:bg-gray-100 transition-colors"
																>
																	<X className="w-4 h-4" />
																</button>
															</li>
														))
													) : (
														<li className="text-sm text-red-500 italic">Aucun projet lié !</li>
													)}
												</ul>
											</details>
										</li>
									))}
								</ul>
							)}
						</div>
					</div>
				</div>

				{/* Liste des projets */}
				{/* <div className="bg-white rounded-xl border border-gray-200">
					<div className="p-6 border-b border-gray-200">
						<h3 className="text-lg font-semibold text-gray-900">
							Projets
						</h3>
					</div>
					<div className="p-6">
						<div className="">
							{isloading ? (
								<div className="flex items-center justify-center gap-3 p-3">
									<Radius className='animate-spin w-4 h-4 text-teal-950' />
									<span className="ml-2 text-gray-700">Chargement des projets...</span>
								</div>
							) : projets.length === 0 ? (
								<div className='flex flex-col items-center justify-center gap-3 p-3'>
									<div className="flex items-center justify-center gap-3">
										<Info className='w-4 h-4 text-red-800' />
										<span className="ml-2 text-gray-700">Aucun projet trouvé</span>
									</div>
									<button
										onClick={() => setShowProjetForm(true)}
										className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
									>
										<Plus className="w-4 h-4" />
										Ajouter
									</button>
								</div>
							) : (
								<div className="grid grid-cols-1 gap-3">
									{projets.map((proj) => (
										<div key={proj.id} className="bg-white rounded-xl border border-gray-200 p-3">
											<div className="flex items-center justify-between">
												<div className='flex items-center gap-3'>
													<div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
														<span className="text-sm font-medium text-orange-700">
															{proj.nom.charAt(0).toUpperCase()}
														</span>
													</div>
													<span className="text-sm font-medium text-gray-900">{proj.nom}</span>
													<span className="text-sm font-medium text-gray-900">{proj.client.nom}</span>
												</div>
												<span className="text-sm text-gray-600">ID: {proj.id}</span>
											</div>
										</div>
									))}
								</div>
							)}
						</div>
					</div>
				</div> */}
			</div>
		</div>
	)
}