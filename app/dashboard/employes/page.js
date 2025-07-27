"use client";

import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, User, Upload, Radius, Info, Search, Check, ChevronsDownUp, ListFilter } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios'
import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/20/solid'

export default function Page() {
	const [showForm, setShowForm] = useState(false);
	const [employes, setEmployes] = useState([])
	const [isloading, setIsLoading] = useState(true)
	const [loading, setLoading] = useState(false)
	const [departements, setDepartements] = useState([]);
	const [selectedDept, setSelectedDept] = useState(departements[0] || { id: null, nom: 'Tous...' });
	const [editMode, setEditMode] = useState(false);
	const [selectedEmploye, setSelectedEmploye] = useState(null);
	const [searchTerm, setSearchTerm] = useState('');

	const [form, setForm] = useState({
		email: '',
		password: '',
		nom: '',
		prenom: '',
		telephone: '',
		adresse: '',
		genre: '',
		dateNaissance: '',
		dateEntree: '',
		poste: '',
		salaire: '',
		departementId: '',
	});
	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	// Fonction pour récupérer la liste des employés
	const fetchEmployes = async () => {
		try {
			const res = await axios.get('/api/employes');
			setEmployes(res.data)
		} catch (error) {
			toast.error('Erreur lors du chargement des employés.')
		} finally {
			setIsLoading(false)
		}
	}
	useEffect(() => {
		fetchEmployes()
	}, [])

	// Fonction pour récupérer la liste des départements
	const fetchDepartements = async () => {
		try {
			const res = await axios.get('/api/departements')
			setDepartements(res.data)
		} catch (error) {
			toast.error('Erreur lors du chargement des départements.')
		}
	}
	useEffect(() => {
		fetchDepartements()
	}, [])

	const emptyForm = {
		email: '',
		password: '',
		nom: '',
		prenom: '',
		telephone: '',
		adresse: '',
		genre: '',
		dateNaissance: '',
		dateEntree: '',
		poste: '',
		salaire: '',
		departementId: '',
	};

	// Fonction pour enregistrer un nouvel employé
	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true)
		const toastId = toast.loading(editMode ? "Mise à jour de l’employé..." : "Enregistrement de l’employé...");
		try {
			const res = await fetch(editMode ? `/api/employes/${selectedEmploye.id}` : '/api/employes', {
				method: editMode ? 'PUT' : 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(form),
			});

			const data = await res.json();

			if (!res.ok) {
				toast.error(data.error || "Erreur lors de l'enregistrement", { id: toastId });
				return;
			}
			toast.success(editMode
				? `Employé modifié avec succès.`
				: `Employé ${data.nom} ${data.prenom} ajouté avec succès.`,
				{ id: toastId }
			);

			setForm(emptyForm);
			setShowForm(false);
			fetchEmployes();
			setEditMode(false);
			setSelectedEmploye(null);

		} catch (err) {
			toast.error('Erreur lors de l\'enregistrement.', { id: toastId })
		} finally {
			setLoading(false)
		}
	};

	const formatDate = (dateStr) => {
		if (!dateStr) return '';
		const date = new Date(dateStr);
		return date.toLocaleDateString('fr-FR');
	};

	// Fonction pour supprimer un employé
	const handleDelete = async (id) => {
		const confirm = window.confirm('Supprimer cet employé ?')
		if (!confirm) return

		const toastId = toast.loading('Suppression en cours...')

		try {
			await axios.delete(`/api/employes/${id}`)
			toast.success('Employé supprimé.', { id: toastId })
			fetchEmployes() // Recharger la liste des employés
		} catch (error) {
			toast.error('Erreur lors de la suppression.', { id: toastId })
		}
	}

	// 🔍 Filtrage dynamique
	const filteredEmployes = employes.filter((employe) => {
		const fullName = `${employe.nom} ${employe.prenom}`.toLowerCase();
		const matchesSearch = fullName.includes(searchTerm.toLowerCase());
		const matchesDept = selectedDept.id ? employe.departement?.id === selectedDept.id : true;
		return matchesSearch && matchesDept;
	});


	return (
		<div>
			{showForm && (
				<div className="bg-white rounded-xl border border-gray-200 p-6 mb-2">
					<h3 className="text-lg font-semibold text-gray-900 mb-4">
						Nouvel employé
					</h3>
					<form onSubmit={handleSubmit} className="space-y-4 text-black">
						<div className="bg-orange-100 p-1 my-4 border-b border-gray-200 mb-4 text-orange-600 text-xl">
							<span className='uppercase'>Informations deptnelles</span>
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
									required
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
									required
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-black mb-1">
									Date de naissance
								</label>
								<input
									name="dateNaissance"
									value={form.dateNaissance} onChange={handleChange}
									type="date"
									className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
									required
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-black mb-1">
									Genre
								</label>
								<select
									name="genre"
									value={form.genre} onChange={handleChange}
									className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
									required
								>
									<option value="">Sélectionner un genre</option>
									<option value="M">Masculin</option>
									<option value="F">Féminin</option>
								</select>
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
									required
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
									required
								/>
							</div>
						</div>
						<div className="bg-orange-100 p-1 my-4 border-b border-gray-200 mb-4 text-orange-600 text-xl">
							<span className='uppercase'>Informations sur le poste</span>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-black mb-1">
									Poste
								</label>
								<input
									name="poste"
									value={form.poste} onChange={handleChange}
									type="text"
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
									required
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-black mb-1">
									Département
								</label>
								<select
									name="departementId"
									value={form.departementId} onChange={handleChange}
									className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
									required
								>
									<option value="">Sélectionner un département</option>
									{departements.map(dep => (
										<option key={dep.id} value={dep.id}>{dep.nom}</option>
									))}
								</select>
							</div>
							<div>
								<label className="block text-sm font-medium text-black mb-1">
									Salaire
								</label>
								<input
									name="salaire"
									type="number"
									value={form.salaire} onChange={handleChange}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
									required
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-black mb-1">
									Date d&apos;embauche
								</label>
								<input
									name="dateEntree"
									value={form.dateEntree} onChange={handleChange}
									type="date"
									className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
									required
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
									required
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
									required
								/>
							</div>
						</div>
						<div className="flex gap-2">
							<button
								type="submit"
								className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
							>
								{loading ? 'Ajout en cours...' : 'Ajouter'}
							</button>
							{editMode ? (
								<button
									type="button"
									className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400 transition-colors"
									onClick={() => {
										setEditMode(false);
										setSelectedEmploye(null);
										setForm(emptyForm);
									}}
								>
									Annuler la modification
								</button>
							) : (
								<button
									type="button"
									onClick={() => setShowForm(false)}
									className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400 transition-colors"
								>
									Annuler
								</button>
							)}
						</div>
					</form>
				</div>
			)}

			<div className="flex items-center justify-between gap-3 mb-4">
				{/* Champ de tri */}
				<Listbox value={selectedDept} onChange={setSelectedDept}>
					<div className="relative text-black">
						<ListboxButton className="cursor-pointer p-2 rounded-md bg-white text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-teal-600 sm:text-sm/6">
							{/* <span className="flex items-center gap-3 pr-6">
								<span className="hidden">{selectedDept ? selectedDept.nom : 'Tous les départements'}</span>
							</span> */}
							<ListFilter size={20} color="#333" />
						</ListboxButton>

						<ListboxOptions
							transition
							className="absolute z-10 mt-1 max-h-56 min-w-max overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-hidden data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:text-sm"
						>
							{[{ id: null, nom: 'Tous...' }, ...departements].map((dept) => (
								<ListboxOption
									key={dept.id ?? 'all'}
									value={dept}
									className="group relative cursor-default py-2 pr-9 pl-3 text-gray-900 select-none data-focus:bg-teal-600 data-focus:text-white data-focus:outline-hidden"
								>
									<div className="flex items-center min-w-max">
										<span className="ml-3 block truncate font-normal group-data-selected:font-semibold">{dept.nom}</span>
									</div>

									<span className="absolute inset-y-0 right-0 flex items-center pr-4 text-teal-600 group-not-data-selected:hidden group-data-focus:text-white">
										<CheckIcon aria-hidden="true" className="size-5" />
									</span>
								</ListboxOption>
							))}
						</ListboxOptions>
					</div>
				</Listbox>

				{/* Champ de recherche */}
				<div className="bg-white rounded-md border border-gray-300 flex items-center gap-x-2 p-2 overflow-hidden w-full">
					<Search size={15} color="gray" />
					<input
						type="text"
						placeholder="Rechercher employé..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="bg-transparent w-full border-none outline-none ring-0 focus:ring-0 focus:border-none focus:outline-none"
					/>
				</div>

				<button
					onClick={() => setShowForm(true)}
					className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
				>
					<Plus className="w-4 h-4" />
					Ajouter
				</button>
			</div>

			<div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
				<div className="p-3 border-b border-gray-200 flex items-center justify-between">
					<h3 className="text-lg font-semibold text-gray-900">Liste des employés</h3>
					<button
						onClick={() => setShowForm(true)}
						className="flex items-center cursor-pointer border border-gray-300 gap-2 p-2 bg-gray-100 text-black rounded-lg hover:bg-gray-200 transition-colors"
					>
						<Upload className="w-4 h-4" />
					</button>
				</div>
				<div className="overflow-x-auto custom-scrollbar">
					{isloading ? (
						<div className="flex items-center justify-center gap-3 p-3">
							<Radius className='animate-spin w-4 h-4 text-teal-950' />
							<span className="ml-2 text-gray-700">Chargement des employés...</span>
						</div>
					) : employes.length === 0 ? (
						<div className='flex flex-col items-center justify-center gap-3 p-3'>
							<div className="flex items-center justify-center gap-3">
								<Info className='w-4 h-4 text-red-800' />
								<span className="ml-2 text-gray-700">Aucun employé trouvé</span>
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
										Employé
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Genre
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Date de naissance
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Téléphone
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Adresse
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Poste
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Département
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Salaire
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Date d&apos;embauche
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Mot de passe
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Actions
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{filteredEmployes.map(emp => (
									<tr key={emp.id} className="hover:bg-gray-50">
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="flex items-center gap-3">
												<div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
													<User className="w-5 h-5 text-teal-600" />
												</div>
												<div>
													<p className="font-medium text-gray-900">{emp.nom}&nbsp;{emp.prenom}</p>
													<p className="text-sm text-gray-500">{emp.email}</p>
												</div>
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
											{emp.genre === 'M' ? 'M' : emp.genre === 'F' ? 'F' : emp.genre}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
											{formatDate(emp.dateNaissance)}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
											{emp.telephone || 'Non renseigné'}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
											{emp.adresse || 'Non renseigné'}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
											{emp.poste}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
											{emp.departement.nom}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
											{emp.salaire} FCFA
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
											{formatDate(emp.dateEntree)}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
											********
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
											<div className="flex gap-2">
												<button
													onClick={() => {
														setForm(emp);
														setEditMode(true);
														setSelectedEmploye(emp);
														setShowForm(true);
													}}
													className="flex items-center gap-2 cursor-pointer px-2 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
												>
													<Edit className="w-4 h-4" />
												</button>
												<button
													onClick={() => handleDelete(emp.id)}
													className="flex items-center gap-2 cursor-pointer px-2 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
												>
													<Trash2 className="w-4 h-4" />
												</button>
											</div>
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