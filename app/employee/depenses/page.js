"use client";

import React, { useState, useEffect } from 'react';
import { Check, File, Filter, Info, ListFilter, Plus, Radius, Upload, User, X } from 'lucide-react';
import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/20/solid';
import { formatDate } from '@/lib/date';

import { submitForm } from '@/lib/api/apiDepense';
import { fetchDepenses } from '@/lib/api/apiDepenseUser';
import { handleFormChange } from '@/lib/api/formUtils';
import { fetchProjets } from '@/lib/api/apiProjet';

export default function Page() {
	const [showForm, setShowForm] = useState(false);
	const [projets, setProjets] = useState([]);
	const [depenses, setDepenses] = useState([]);
	const [isloading, setIsLoading] = useState(true);
	const [loading, setLoading] = useState(false);
	const [previewUrl, setPreviewUrl] = useState(null);

	const filtresDepenses = [
		{ id: null, nom: 'Toutes' },
		{ id: 'EN_ATTENTE', nom: 'En attente' },
		{ id: 'ACCEPTE', nom: 'Acceptées' },
		{ id: 'REFUSE', nom: 'Refusées' },
	];
	const [selectedStatus, setSelectedStatus] = useState(filtresDepenses[0]);
	const filteredDepenses = selectedStatus.id
		? depenses.filter(d => d.statut === selectedStatus.id)
		: depenses;

	// Récupération des dépenses & projets
	useEffect(() => {
		fetchProjets(setProjets, setIsLoading);
		fetchDepenses(setDepenses, setIsLoading);
	}, []);

	const total = depenses.length;

	const enAttente = depenses.filter(d => d.statut === 'EN_ATTENTE').length;
	const acceptees = depenses.filter(d => d.statut === 'ACCEPTE').length;
	const refusees = depenses.filter(d => d.statut === 'REFUSE').length;

	const [form, setForm] = useState({
		description: '',
		projetId: '',
		montant: ''
	});
	const handleChange = (e) => handleFormChange(e, form, setForm);

	// Fonction pour enregistrer une nouvelle dépense
	const handleSubmit = async (e) => {
		e.preventDefault();
		await submitForm({
			data: form,
			setLoading,
			setShowForm,
			reload: () => fetchDepenses(setDepenses, setIsLoading),
			successMessage: "Dépense ajoutée avec succès.",
			errorMessage: "Erreur lors de l'ajout de la dépense.",
		});
	};

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		setForm(prev => ({ ...prev, fichier: file }));

		if (file) {
			const url = URL.createObjectURL(file);
			setPreviewUrl(url);
		} else {
			setPreviewUrl(null);
		}
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
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
									className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									required
								/>
							</div>
						</div>
						<div className="col-span-full">
							<label htmlFor="file-upload" className="block text-sm/6 font-medium text-blue-950">
								Justificatif (image ou PDF)
							</label>

							<div className="mt-2 flex justify-center rounded-lg border border-dashed border-blue-950/25 bg-blue-50 px-6 py-10">
								<div className="text-center">
									<File className="mx-auto size-12 text-gray-600" />
									<div className="mt-4 flex text-sm/6 text-gray-400">
										<label
											htmlFor="file-upload"
											className="relative cursor-pointer rounded-md bg-transparent font-semibold text-indigo-400 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-500 hover:text-indigo-300"
										>
											<span>Téléverser un fichier</span>
											<input
												id="file-upload"
												name="file-upload"
												type="file"
												accept="image/*,application/pdf"
												onChange={handleFileChange}
												className="sr-only"
											/>
										</label>
										<p className="pl-1">ou glisser-déposer</p>
									</div>
									<p className="text-xs/5 text-gray-400">PNG, JPG, PDF jusqu'à 10MB</p>

									{/* Preview */}
									{previewUrl && (
										<div className="mt-4">
											{form.fichier?.type.startsWith('image/') ? (
												<img
													src={previewUrl}
													alt="Aperçu"
													className="mx-auto max-h-48 rounded-lg border border-gray-300 shadow"
												/>
											) : (
												<a
													href={previewUrl}
													target="_blank"
													rel="noopener noreferrer"
													className="text-blue-400 underline"
												>
													Voir
												</a>
											)}
										</div>
									)}
								</div>
							</div>
						</div>
						<div className="flex gap-2">
							<button
								type="submit"
								className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
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
			</div>

			{/* Statistiques */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
				<div className="bg-white rounded-lg border border-gray-200 p-4">
					<p className="text-sm text-gray-600">Total des dépenses</p>
					<p className="text-2xl font-bold text-gray-900">{total}</p>
				</div>
				<div className="bg-white rounded-lg border border-gray-200 p-4">
					<p className="text-sm text-gray-600">En attente</p>
					<p className="text-2xl font-bold text-yellow-600">{enAttente}</p>
				</div>
				<div className="bg-white rounded-lg border border-gray-200 p-4">
					<p className="text-sm text-gray-600">Approuvées</p>
					<p className="text-2xl font-bold text-green-600">{acceptees}</p>
				</div>
				<div className="bg-white rounded-lg border border-gray-200 p-4">
					<p className="text-sm text-gray-600">Refusées</p>
					<p className="text-2xl font-bold text-red-600">{refusees}</p>
				</div>
			</div>

			<div className="flex items-center justify-between mb-3">
				<Listbox value={selectedStatus} onChange={setSelectedStatus}>
					<div className="relative text-black">
						<ListboxButton className="flex items-center cursor-pointer gap-2 font-medium px-3 py-2 rounded-md bg-white text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6">
							<ListFilter size={20} color="#333" />
							Statut
						</ListboxButton>

						<ListboxOptions
							transition
							className="absolute z-10 mt-1 max-h-56 min-w-max overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-hidden data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:text-sm"
						>
							{filtresDepenses.map((statut) => (
								<ListboxOption
									key={statut.id ?? 'all'}
									value={statut}
									className="group relative cursor-default py-2 pr-9 pl-3 text-gray-900 select-none data-focus:bg-blue-600 data-focus:text-white data-focus:outline-hidden"
								>
									<div className="flex items-center min-w-max">
										<span className="ml-3 block truncate font-normal group-data-selected:font-semibold">{statut.nom}</span>
									</div>
									<span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600 group-not-data-selected:hidden group-data-focus:text-white">
										<CheckIcon aria-hidden="true" className="size-5" />
									</span>
								</ListboxOption>
							))}
						</ListboxOptions>
					</div>
				</Listbox>

				<button
					onClick={() => setShowForm(true)}
					className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
				>
					<Plus className="w-4 h-4" />
					Ajouter
				</button>
			</div>

			<div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
				<div className="p-3 border-b border-gray-200 flex items-center justify-between">
					<h3 className="text-lg font-semibold text-gray-900">Liste des dépenses</h3>
				</div>
				<div className="overflow-x-auto custom-scrollbar">
					{isloading ? (
						<div className="flex items-center justify-center gap-2 p-2">
							<Radius className='animate-spin w-4 h-4 text-blue-950' />
							<span className="ml-2 text-gray-700">Chargement des dépenses...</span>
						</div>
					) : total === 0 ? (
						<div className='flex flex-col items-center justify-center gap-2 p-2'>
							<div className="flex items-center justify-center gap-2">
								<Info className='w-4 h-4 text-red-800' />
								<span className="ml-2 text-gray-700">Aucun département trouvé</span>
							</div>
							<button
								onClick={() => setShowForm(true)}
								className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
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
										Justificatif
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Statut
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{filteredDepenses.map((dep) => (
									<tr key={dep.id} className="hover:bg-gray-50">
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="flex items-center gap-3">
												<div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
													<span className="text-sm font-medium text-blue-700">
														{
															(dep.projet.client.nom).split(' ').map(n => n[0]).join('')
														}
													</span>
												</div>
												<div>
													<p className="font-medium text-gray-900">{dep.projet.nom}</p>
													<p className="text-sm text-gray-500">{dep.projet.client.nom}</p>
												</div>
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
											{dep.description}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
											{dep.montant.toLocaleString()} Fcfa
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
											{formatDate(dep.date)}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
											{dep.fichiers.length > 0 ? (
												dep.fichiers.map((file) => (
													<div key={file.id} className="mb-2">
														<a
															href={file.url}
															download={file.name}
															className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition"
														>
															⬇️ Télécharger : {file.name}
														</a>
													</div>
												))
											) : (
												<span className="text-gray-400 italic">Aucun justificatif</span>
											)}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
											{dep.statut === "EN_ATTENTE" && (
												<span className="inline-flex animate-pulse px-2 py-1 text-xs text-gray-800 font-medium rounded-full bg-gray-300">
													En attente
												</span>
											)}
											{dep.statut === 'ACCEPTE' && (
												<span className="inline-flex px-2 py-1 text-xs text-green-800 font-medium rounded-full bg-green-300">
													Dépense validée
												</span>
											)}
											{dep.statut === 'REFUSE' && (
												<span className="inline-flex px-2 py-1 text-xs text-red-800 font-medium rounded-full bg-red-300">
													Dépense refusée
												</span>
											)}
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