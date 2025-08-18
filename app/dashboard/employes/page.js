"use client";

import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, User, Upload, Radius, Info, Search, ListFilter, Eye, CloudUpload } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios'
import { Listbox, ListboxButton, ListboxOptions, ListboxOption, Dialog, DialogBackdrop, DialogPanel, DialogTitle, TransitionChild } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { CheckIcon } from '@heroicons/react/20/solid'
import { supabase } from '@/lib/supabase';

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
	const [pdfs, setPdfs] = useState([]);
	const [selectedDetails, setSelectedDetails] = useState(null);
	const [showDrawer, setShowDrawer] = useState(false);

	const handleFileChange = (e) => {
		const selectedFiles = Array.from(e.target.files);
		const pdfFiles = selectedFiles.filter(file => file.type === 'application/pdf');

		setPdfs(pdfFiles);
	};

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
		dateSortie: '',
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
		setLoading(true);
		const toastId = toast.loading(editMode ? "Mise à jour de l’employé..." : "Enregistrement de l’employé...");

		try {
			let uploadedFiles = [];
			const sanitizeFileName = (name) =>
				name.normalize("NFD") // enlève les accents
					.replace(/[\u0300-\u036f]/g, "") // supprime les diacritiques
					.replace(/[^a-zA-Z0-9._-]/g, "_"); // remplace les caractères spéciaux par _

			// 📁 Upload des fichiers PDF dans Supabase Storage
			if (pdfs.length > 0) {
				for (const file of pdfs) {


					// Exemple d’utilisation :
					const safeFileName = sanitizeFileName(file.name);
					const filePath = `employes/${sanitizeFileName(form.nom)}_${sanitizeFileName(form.prenom)}/${Date.now()}_${safeFileName}`;
					const { data, error } = await supabase.storage
						.from("user-files")
						.upload(filePath, file);

					if (error) {
						console.error(error);
						toast.error(`Erreur lors de l'envoi du fichier ${file.name}`, { id: toastId });
						continue;
					}

					// 📎 Récupérer l'URL publique
					const { data: publicUrlData } = supabase
						.storage
						.from("user-files")
						.getPublicUrl(filePath);

					if (publicUrlData?.publicUrl) {
						uploadedFiles.push({
							name: file.name,
							url: publicUrlData.publicUrl,
						});
					}

				}
			}

			// 🗃️ Enregistrer l’employé + documents dans la base de données
			const res = await fetch(editMode ? `/api/employes/${selectedEmploye.id}` : '/api/employes', {
				method: editMode ? 'PUT' : 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					...form,
					files: uploadedFiles, // <-- On ajoute les URLs ici
				}),
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
			setPdfs([]);
			setShowForm(false);
			setEditMode(false);
			setSelectedEmploye(null);
			fetchEmployes();

		} catch (err) {
			console.error(err);
			toast.error('Erreur lors de l\'enregistrement.', { id: toastId });
		} finally {
			setLoading(false);
		}
	};
	const removePdf = (index) => {
		setPdfs(prev => prev.filter((_, i) => i !== index));
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
			if (employe.files && employe.files.length > 0) {
				const filePaths = employe.files.map(file => {
					// Supprime la partie publique de l'URL pour retrouver le chemin dans le bucket
					const url = new URL(file.url);
					return decodeURIComponent(url.pathname.replace(/^\/storage\/v1\/object\/public\//, ''));
				});

				const { error } = await supabase.storage
					.from('user-files')
					.remove(filePaths);

				if (error) {
					console.error('Erreur suppression fichiers storage :', error);
				}
			}
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
									Date d&apos;entrée
								</label>
								<input
									name="dateEntree"
									value={form.dateEntree} onChange={handleChange}
									type="date"
									className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
									required
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-black mb-1">
									Date de sortie
								</label>
								<input
									name="dateSortie"
									value={form.dateSortie} onChange={handleChange}
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
						<div className="bg-orange-100 p-1 my-4 border-b border-gray-200 mb-4 text-orange-600 text-xl">
							<span className='uppercase'>Documents associés</span>
						</div>
						<div className="flex-1 items-center max-w-screen-sm mx-auto mb-3 space-y-4 sm:flex sm:space-y-0">
							<div className="relative w-full">
								<div className="items-center justify-center max-w-xl mx-auto">
									<label className="flex justify-center w-full h-32 px-4 transition 
											bg-white border-2 border-gray-300 border-dashed rounded-md 
											appearance-none cursor-pointer hover:border-gray-400 
											focus:outline-none" id="drop">
										<span className="flex items-center space-x-2">
											<CloudUpload size={20} color="#8d8d8dff" />
											<span className="font-medium text-gray-600">
												Drop des fichiers PDF ou
												<span className="text-blue-600 underline ml-[4px]">parcourir</span>
											</span>
										</span>
										<input
											type="file"
											name="file_upload"
											className="hidden"
											accept="application/pdf"
											multiple
											id="input"
											onChange={handleFileChange}
										/>
									</label>
								</div>
							</div>
						</div>

						{/* Affichage des fichiers PDF */}
						<div className="max-w-xl mx-auto mt-4 space-y-2">
							{pdfs.map((pdf, index) => (
								<div key={index} className="flex items-center justify-between px-4 py-2 bg-orange-50 rounded">
									<span className="text-gray-700 truncate">{pdf.name}</span>
									<div className="flex items-center gap-2">
										<a
											href={URL.createObjectURL(pdf)}
											target="_blank"
											rel="noopener noreferrer"
											className="text-blue-600 underline text-sm"
										>
											<Eye size={20} />
										</a>
										<button
											type="button"
											onClick={() => removePdf(index)}
											className="text-red-500 hover:text-red-700"
										>
											<Trash2 size={20} />
										</button>
									</div>
								</div>
							))}
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
										Date d&apos;embauche
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
											{formatDate(emp.dateEntree)}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
											<div className="flex gap-2">
												<button
													onClick={() => {
														setSelectedDetails(emp);
														setShowDrawer(true);
													}}
													className="flex items-center gap-2 cursor-pointer px-2 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
												>
													<Eye className="w-4 h-4" />
												</button>
												<button
													onClick={() => {
														setForm(emp);
														setEditMode(true);
														setSelectedEmploye(emp);
														setShowForm(true);
													}}
													className="flex items-center gap-2 cursor-pointer px-2 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
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

			<Dialog open={showDrawer} onClose={setShowDrawer} className="relative z-50">
				<DialogBackdrop
					transition
					className="fixed inset-0 bg-gray-900/50 transition-opacity duration-500 ease-in-out data-closed:opacity-0"
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
											onClick={() => setShowDrawer(false)}
											className="relative rounded-md text-gray-400 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
										>
											<span className="absolute -inset-2.5" />
											<span className="sr-only">Close panel</span>
											<XMarkIcon aria-hidden="true" className="size-6" />
										</button>
									</div>
								</TransitionChild>
								<div className="relative flex h-full flex-col overflow-y-auto bg-gray-50 py-6 shadow-xl after:absolute after:inset-y-0 after:left-0 after:w-px after:bg-white/10">
									<div className="px-4 sm:px-6">
										<DialogTitle className="text-base font-semibold text-black">Toutes les informations</DialogTitle>
									</div>
									<div className="relative mt-6 flex-1 px-4 sm:px-6">
										{showDrawer && selectedDetails && (
											<div className="space-y-6 text-sm text-gray-800">

												{/* Bloc : Informations personnelles */}
												<div>
													<h3 className="text-md font-semibold text-orange-600 mb-2 uppercase border-b border-gray-200 pb-1">Informations personnelles</h3>
													<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
														<p><strong>Nom :</strong> {selectedDetails.nom}</p>
														<p><strong>Prénom :</strong> {selectedDetails.prenom}</p>
														<p><strong>Date de naissance :</strong> {formatDate(selectedDetails.dateNaissance)}</p>
														<p><strong>Genre :</strong> {selectedDetails.genre}</p>
														<p><strong>Téléphone :</strong> {selectedDetails.telephone}</p>
														<p><strong>Adresse :</strong> {selectedDetails.adresse}</p>
													</div>
												</div>

												{/* Bloc : Informations sur le poste */}
												<div>
													<h3 className="text-md font-semibold text-orange-600 mb-2 uppercase border-b border-gray-200 pb-1">Informations sur le poste</h3>
													<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
														<p><strong>Poste :</strong> {selectedDetails.poste}</p>
														<p><strong>Département :</strong> {selectedDetails.departement?.nom || 'Non renseigné'}</p>
														<p><strong>Salaire :</strong> {selectedDetails.salaire} FCFA</p>
														<p><strong>Date d’entrée :</strong> {formatDate(selectedDetails.dateEntree)}</p>
														<p><strong>Date de sortie :</strong> {formatDate(selectedDetails.dateSortie)}</p>
													</div>
												</div>

												{/* Bloc : Informations de connexion */}
												<div>
													<h3 className="text-md font-semibold text-orange-600 mb-2 uppercase border-b border-gray-200 pb-1">Informations de connexion</h3>
													<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
														<p><strong>Email :</strong> {selectedDetails.email}</p>
														<p><strong>Mot de passe :</strong>***********</p>
														{/* Tu peux ajouter d’autres infos comme le rôle si besoin */}
													</div>
												</div>

												{/* Bloc : Fichiers joints */}
												<div>
													<h3 className="text-md font-semibold text-orange-600 mb-2 uppercase border-b border-gray-200 pb-1">Documents</h3>
													{selectedDetails.files?.length > 0 ? (
														<ul className="space-y-2">
															{selectedDetails.files.map((file, index) => (
																<li key={index} className="flex justify-between items-center bg-orange-50 p-2 rounded border">
																	<span className="truncate">{file.name}</span>
																	<a
																		href={file.url}
																		target="_blank"
																		rel="noopener noreferrer"
																		className="text-blue-600 hover:underline text-sm"
																	>
																		Voir
																	</a>
																</li>
															))}
														</ul>
													) : (
														<p className="text-gray-500 text-sm">Aucun fichier enregistré.</p>
													)}
												</div>
											</div>
										)}
									</div>
								</div>
							</DialogPanel>
						</div>
					</div>
				</div>
			</Dialog>
		</div>
	)
}