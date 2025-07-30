"use client";

import React, { useState, useEffect } from 'react';
import { Check, Filter, Info, Plus, Radius, Upload, User, X } from 'lucide-react';

import { submitForm } from '@/lib/api/apiDepense';
import { fetchDepenses } from '@/lib/api/apiDepense';
import { handleFormChange } from '@/lib/api/formUtils';
import { fetchProjets } from '@/lib/api/apiProjet';

export default function Page() {
	const [showForm, setShowForm] = useState(false);
	const [projets, setProjets] = useState([]);
	const [depenses, setDepenses] = useState([]);
	const [isloading, setIsLoading] = useState(true);
	const [loading, setLoading] = useState(false);

	// Récupération des projets
	useEffect(() => {
		fetchProjets(setProjets, setIsLoading);
		fetchDepenses(setDepenses, setIsLoading);
	}, []);

	const [form, setForm] = useState({
		description: '',
		projetId: '',
		montant: '',
	});
	const handleChange = (e) => handleFormChange(e, form, setForm);

	// Fonction pour enregistrer une nouvelle dépense
	const handleSubmit = async (e) => {
		e.preventDefault();
		await submitForm({
			data: form,
			setLoading,
			setShowForm,
			reload: fetchProjets,
			successMessage: "Dépense ajoutée avec succès.",
			errorMessage: "Erreur lors de l'ajout de la dépense.",
		});
	};

	return (
		<div>
			{showForm && (
				<div className="bg-white rounded-xl border border-gray-200 p-6 mb-2">
					<h3 className="text-lg font-semibold text-gray-900 mb-4">
						Informations sur la dépense
					</h3>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Description
								</label>
								<input
									type="text"
									name="description"
									value={form.description} onChange={handleChange}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
									required
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-black mb-1">
									Projet
								</label>
								<select
									name="projetId"
									value={form.projetId} onChange={handleChange}
									className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
									required
								>
									<option value="">Sélectionner un projet</option>
									{projets.map(projet => (
										<option key={projet.id} value={projet.id}>{projet.nom}</option>
									))}
								</select>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Montant
								</label>
								<input
									type="number"
									name="montant"
									value={form.montant} onChange={handleChange}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
									required
								/>
							</div>
						</div>
						<div className="flex gap-2">
							<button
								type="submit"
								className="cursor-pointer px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
							>
								{loading ? 'Ajout en cours...' : 'Ajouter'}
							</button>
							<button
								type="button"
								onClick={() => setShowForm(false)}
								className="cursor-pointer px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
							>
								Annuler
							</button>
						</div>
					</form>
				</div>
			)}

			<div className="flex items-center justify-between mb-3">
				<h1 className="text-2xl font-bold text-gray-900">Gestion des dépenses</h1>
				<div className="flex items-center gap-2">
					<div className="flex items-center gap-2 rounded-lg bg-white border border-gray-300 px-4 py-2">
						<Filter className="w-4 h-4 text-gray-500" />
						<select
							className="border-none outline-none focus:ring-0 focus:ring-none focus:border-transparent text-black"
						>
							<option value="all">Toutes les dépenses</option>
							<option value="pending">En attente</option>
							<option value="approved">Approuvées</option>
							<option value="rejected">Refusées</option>
						</select>
					</div>
					<button
						onClick={() => setShowForm(true)}
						className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
					>
						<Plus className="w-4 h-4" />
						Ajouter
					</button>
				</div>
			</div>

			{/* Statistiques */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
				<div className="bg-white rounded-lg border border-gray-200 p-4">
					<p className="text-sm text-gray-600">Total des dépenses</p>
					<p className="text-2xl font-bold text-gray-900">10</p>
				</div>
				<div className="bg-white rounded-lg border border-gray-200 p-4">
					<p className="text-sm text-gray-600">En attente</p>
					<p className="text-2xl font-bold text-yellow-600">
						3
					</p>
				</div>
				<div className="bg-white rounded-lg border border-gray-200 p-4">
					<p className="text-sm text-gray-600">Approuvées</p>
					<p className="text-2xl font-bold text-green-600">
						6
					</p>
				</div>
				<div className="bg-white rounded-lg border border-gray-200 p-4">
					<p className="text-sm text-gray-600">Montant total</p>
					<p className="text-2xl font-bold text-gray-900">
						{("1 000 000").toLocaleString()}€
					</p>
				</div>
			</div>

			<div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
				<div className="p-3 border-b border-gray-200 flex items-center justify-between">
					<h3 className="text-lg font-semibold text-gray-900">Dépenses</h3>
					<button
						onClick={() => setShowForm(true)}
						className="flex items-center cursor-pointer border border-gray-300 gap-2 p-2 bg-gray-100 text-black rounded-lg hover:bg-gray-200 transition-colors"
					>
						<Upload className="w-4 h-4" />
					</button>
				</div>
				<div className="overflow-x-auto custom-scrollbar">
					{isloading ? (
						<div className="flex items-center justify-center gap-2 p-2">
							<Radius className='animate-spin w-4 h-4 text-teal-950' />
							<span className="ml-2 text-gray-700">Chargement des dépenses...</span>
						</div>
					) : depenses.length === 0 ? (
						<div className='flex flex-col items-center justify-center gap-2 p-2'>
							<div className="flex items-center justify-center gap-3">
								<Info className='w-4 h-4 text-red-800' />
								<span className="ml-2 text-gray-700">Aucun département trouvé</span>
							</div>
							<button
								onClick={() => setShowForm(true)}
								className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
							>
								<Plus className="w-4 h-4" />
								Ajouter
							</button>
						</div>
					) : (
						<table className="w-full">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Projet
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Description
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Montant
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Date
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Statut
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{depenses.map((dep) => (
									<tr key={dep.id} className="hover:bg-gray-50">
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="flex items-center gap-3">
												<div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
													<span className="text-sm font-medium text-teal-700">
														{
															(dep.projetId).split(' ').map(n => n[0]).join('')
														}
													</span>
												</div>
												<div>
													<p className="font-medium text-gray-900">{dep.projet.nom}</p>
													<p className="text-sm text-gray-500">{dep.projetId}</p>
												</div>
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
											{dep.description}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
											{dep.montant.toLocaleString()} €
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
											{dep.date}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
											<span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-300">
												{dep.statut}
											</span>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					)}
				</div>
			</div>
		</div>
	)
}