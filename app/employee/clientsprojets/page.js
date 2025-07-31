"use client";

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Folder, FolderDot, FolderPlus, Folders, FolderTree, Info, Plus, Radius, Search, Trash2, Upload, UserPlus, X } from 'lucide-react'

export default function Page() {
	const [nom, setNom] = useState('')
	const [loading, setLoading] = useState(false)
	const [clients, setClients] = useState([])
	const [projets, setProjets] = useState([])
	const [isloading, setIsLoading] = useState(true)
	const [searchTerm, setSearchTerm] = useState('');

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
			</div>

			<div className="">
				{/* Liste des clients */}
				<div className="bg-white rounded-xl border border-gray-200">
					<div className="p-3 border-b border-gray-200 flex items-center justify-between">
						<h3 className="text-lg font-semibold text-gray-900">Clients et projets</h3>
						<button
							onClick={() => setShowForm(true)}
							className="flex items-center cursor-pointer border border-gray-300 gap-2 p-2 bg-gray-100 text-black rounded-lg hover:bg-gray-200 transition-colors"
						>
							<Upload className="w-4 h-4" />
						</button>
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
													<div className="flex items-center gap-2"><Folders className='w-4 h-4 text-gray-500' /> {client.nom}</div>
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