"use client";

import React, { useState, useEffect } from 'react'
import { Folder, FolderDot, FolderPlus, Folders, FolderTree, Info, Plus, Radius, Search, Trash2, Upload, UserPlus, X } from 'lucide-react'
import { deleteClient, fetchClients, submitClientForm } from '@/lib/api/apiClient';
import { deleteProjet, fetchProjets, submitProjetForm } from '@/lib/api/apiProjet';
import { formatDate } from '@/lib/date';

export default function Page() {
	const [showClientForm, setShowClientForm] = useState(false);
	const [showProjetForm, setShowProjetForm] = useState(false);
	const [loading, setLoading] = useState(false)
	const [clients, setClients] = useState([])
	const [projets, setProjets] = useState([])
	const [isloading, setIsLoading] = useState(true)
	const [searchTerm, setSearchTerm] = useState('');

	//  Variables pour le formulaire de client et projet
	const [formClient, setFormClient] = useState({
		nom: '',
	});
	const handleClientChange = (e) => {
		setFormClient({ ...formClient, [e.target.name]: e.target.value });
	};
	const [formProjet, setFormProjet] = useState({
		nom: '',
		clientId: '',
	});
	const handleProjetChange = (e) => {
		setFormProjet({ ...formProjet, [e.target.name]: e.target.value });
	};
	
	//  Fonction pour la liste des clients et projets
	useEffect(() => {
		fetchClients(setClients, setIsLoading);
		fetchProjets(setProjets, setIsLoading);
	}, []);

	// Fonction pour enregistrer un nouveau client
	const handleClientSubmit = async (e) => {
		e.preventDefault();
		await submitClientForm({
			data: formClient,
			setLoading,
			setShowForm: setShowClientForm,
			reload: () => fetchClients(setClients, setIsLoading),
			successMessage: "Client ajoutée avec succès.",
			errorMessage: "Erreur lors de l'ajout du client.",
		});
	};
	// Fonction pour enregistrer un nouveau projet
	const handleProjetSubmit = async (e) => {
		e.preventDefault();
		await submitProjetForm({
			data: formProjet,
			setLoading,
			setShowForm: setShowProjetForm,
			reload: () => fetchProjets(setProjets, setIsLoading),
			successMessage: "Projet ajoutée avec succès.",
			errorMessage: "Erreur lors de l'ajout du projet.",
		});
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
									value={formClient.nom} onChange={handleClientChange}
									className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									required
								/>
							</div>
						</div>
						<div className="flex gap-2">
							<button
								type="submit"
								disabled={loading}
								className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
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
									value={formProjet.nom} onChange={handleProjetChange}
									className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									required
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-black mb-1">
									Client associé
								</label>
								<select
									name="clientId"
									value={formProjet.clientId} onChange={handleProjetChange}
									className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
								className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
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
			<div className="flex items-center justify-between gap-3 mb-4">
				{/* Champ de recherche */}
				<div className="bg-white rounded-md border border-gray-300 flex items-center gap-x-2 p-2 overflow-hidden w-full">
					<Search size={15} color="gray" />
					<input
						type="text"
						placeholder="Rechercher"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="bg-transparent w-full border-none outline-none ring-0 focus:ring-0 focus:border-none focus:outline-none"
					/>
				</div>
				<div className="flex items-center gap-2">
					<button
						onClick={() => setShowClientForm(true)}
						className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
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
					<div className="p-3 border-b border-gray-200 flex items-center justify-between">
						<h3 className="text-lg font-semibold text-gray-900">Clients et projets</h3>
					</div>
					<div className="p-6">
						<div className="">
							{isloading ? (
								<div className="flex items-center justify-center gap-1 p-3">
									<Radius className='animate-spin w-4 h-4 text-blue-950' />
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
													<div className="flex items-center gap-2"><Folders className='w-4 h-4 text-gray-500' /> {client.nom}</div>
													<button
														onClick={() => deleteClient(client.id, fetchClients)}
														className="flex items-center gap-2 cursor-pointer px-2 py-2 bg-red-50 text-black rounded-lg hover:bg-red-700 hover:text-white transition-colors"
													>
														<Trash2 className="w-4 h-4" />
													</button>
												</summary>
												<ul className="space-y-3 border-l border-dashed border-blue-900">
													{client.projets && client.projets.length > 0 ? (
														client.projets.map((projet) => (
															<li key={projet.id} className="flex items-center justify-between gap-2">
																<div className='flex flex-col gap-1'>
																	<div className="flex items-center gap-2">
																		<span className="w-8 border-b border-blue-950 border-dashed"></span>
																		<Folder className='w-4 h-4 text-gray-500' />
																		{projet.nom}
																	</div>
																	<div className="flex items-center italic text-sm text-gray-600">
																		<span className="w-4 border-b border-blue-950 border-dashed mr-2"></span>
																		Crée le {formatDate(projet.createdAt)}
																	</div>
																</div>

																<button
																	onClick={() => deleteProjet(projet.id, fetchClients)}
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
									<Radius className='animate-spin w-4 h-4 text-blue-950' />
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
										className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
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