"use client";

import React, { useState, useEffect } from 'react';
import { Check, Filter, Info, ListFilter, Plus, Radius, Upload, User, X } from 'lucide-react';
import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/20/solid';
import { formatDate } from '@/lib/date';

import { handleFormChange } from '@/lib/api/formUtils';
import { fetchConges, submitForm } from '@/lib/api/apiConge';

export default function Page() {
	const [showForm, setShowForm] = useState(false);
	const [conges, setConges] = useState([]);
	const [isloading, setIsLoading] = useState(true);
	const [loading, setLoading] = useState(false);

	const typesConge = [
		{ id: 'MALADIE', nom: 'Maladie' },
		{ id: 'PERSONNEL', nom: 'Personnel' },
		{ id: 'VACANCES', nom: 'Vacances' },
		{ id: 'AUTRE', nom: 'Autre' },
	];
	const filtresConges = [
		{ id: null, nom: 'Toutes' },
		{ id: 'EN_ATTENTE', nom: 'En attente' },
		{ id: 'VALIDE', nom: 'Acceptées' },
		{ id: 'REFUSE', nom: 'Refusées' },
	];
	const [selectedStatus, setSelectedStatus] = useState(filtresConges[0]);
	const filteredConges = selectedStatus.id
	? conges.filter(d => d.type === selectedStatus.id)
	: conges;

	// Récupération conges
	useEffect(() => {
		fetchConges(setConges, setIsLoading);
	}, []);

	const total = conges.length;

	const enAttente = conges.filter(d => d.statut === 'EN_ATTENTE').length;
	const acceptees = conges.filter(d => d.statut === 'VALIDE').length;
	const refusees = conges.filter(d => d.statut === 'REFUSE').length;

	const [form, setForm] = useState({
		raison: '',
		type: '',
		dateDebut: '',
		dateFin: '',
	});
	const handleChange = (e) => handleFormChange(e, form, setForm);

	// Fonction pour enregistrer une nouvelle dépense
	const handleSubmit = async (e) => {
		e.preventDefault();
		await submitForm({
			data: form,
			setLoading,
			setShowForm,
			reload: () => fetchConges(setConges, setIsLoading),
			successMessage: "Congé envoyé avec succès.",
			errorMessage: "Erreur lors de l'envoi du congé.",
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
						<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Raison
								</label>
								<input
									type="text"
									name="raison"
									value={form.raison} onChange={handleChange}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									required
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-black mb-1">
									Type
								</label>
								<select
									name="type"
									value={form.type} onChange={handleChange}
									className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									required
								>
									<option value="">Sélectionner un projet</option>
									{typesConge.map(type => (
										<option key={type.id} value={type.id}>{type.nom}</option>
									))}
								</select>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Date de début
								</label>
								<input
									type="date"
									name="dateDebut"
									value={form.dateDebut} onChange={handleChange}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									required
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Date de fin
								</label>
								<input
									type="date"
									name="dateFin"
									value={form.dateFin} onChange={handleChange}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									required
								/>
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
				<h1 className="text-2xl font-bold text-gray-900">Gestion des congés</h1>
			</div>

			{/* Statistiques */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
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
							{filtresConges.map((statut) => (
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
					<h3 className="text-lg font-semibold text-gray-900">Liste des demandes</h3>
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
							<Radius className='animate-spin w-4 h-4 text-blue-950' />
							<span className="ml-2 text-gray-700">Chargement...</span>
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
										Date d'envoi
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Type
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Raison
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Date de début
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Date de fin
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Statut
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{filteredConges.map((cong) => (
									<tr key={cong.id} className="hover:bg-gray-50">
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
											{formatDate(cong.createdAt)}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
											{cong.type}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
											{cong.raison}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
											{formatDate(cong.dateDebut)}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
											{formatDate(cong.dateFin)}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
											<span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-300">
												{cong.statut}
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