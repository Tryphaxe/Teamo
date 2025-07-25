"use client";

import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, User, Upload, Radius, Info, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios'

export default function Page() {
	const [showForm, setShowForm] = useState(false);
	const [vacances, setVacances] = useState([])
	const [isloading, setIsLoading] = useState(true)
	const [loading, setLoading] = useState(false)
	const [searchTerm, setSearchTerm] = useState('');

	const [form, setForm] = useState({
		nom: '',
		dateDebut: '',
		dateFin: '',
	});
	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	// Fonction pour récupérer la liste des vacances
	const fetchVacances = async () => {
		try {
			const res = await axios.get('/api/vacances');
			setVacances(res.data)
		} catch (error) {
			toast.error('Erreur lors du chargement des vacances.')
		} finally {
			setIsLoading(false)
		}
	}
	useEffect(() => {
		fetchVacances()
	}, [])

	// Fonction pour enregistrer une nouvelle vacance
	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true)
		const toastId = toast.loading("Enregistrement en cours...");
		try {
			const res = await fetch('/api/vacances', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(form),
			});

			const data = await res.json();

			if (!res.ok) {
				toast.error(data.error || "Erreur lors de l'enregistrement", { id: toastId });
				return;
			}
			toast.success(`Vacance ${data.nom} ajouté avec succès.`,
				{ id: toastId }
			);

			setShowForm(false);
			fetchVacances();

		} catch (err) {
			toast.error('Erreur lors de l\'enregistrement.', { id: toastId })
		} finally {
			setLoading(false)
		}
	};

	// Fonction pour supprimer une vacance
	const handleDelete = async (id) => {
		const confirm = window.confirm('Supprimer cette donnée ?')
		if (!confirm) return

		const toastId = toast.loading('Suppression en cours...')

		try {
			await axios.delete(`/api/vacances/${id}`)
			toast.success('Vacance supprimée.', { id: toastId })
			fetchVacances()
		} catch (error) {
			toast.error('Erreur lors de la suppression.', { id: toastId })
		}
	}

	const filteredVacances = vacances.filter((vacance) => {
		const fullName = `${vacance.nom}`.toLowerCase();
		return fullName.includes(searchTerm.toLowerCase());
	});

	const formatDate = (dateStr) => {
		if (!dateStr) return '';
		const date = new Date(dateStr);
		return date.toLocaleDateString('fr-FR');
	};

	return (
		<div>
			{showForm && (
				<div className="bg-white rounded-xl border border-gray-200 p-6 mb-2">
					<h3 className="text-lg font-semibold text-gray-900 mb-4">
						Informations
					</h3>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Titre
								</label>
								<input
									type="text"
									name="nom"
									value={form.nom} onChange={handleChange}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
									required
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Date de début
								</label>
								<input
									type="date"
									name="dateDebut"
									value={form.dateDebut} onChange={handleChange}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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

			<div className="flex items-center justify-between mb-4">
				<h1 className="text-2xl font-bold text-gray-900">Gestion des vacances</h1>
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
				<button
					onClick={() => setShowForm(true)}
					className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
				>
					<Plus className="w-4 h-4" />
					Ajouter
				</button>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
				{isloading ? (
					<div className="flex items-center gap-2 p-3">
						<Radius className='animate-spin w-4 h-4 text-teal-950' />
						<span className="ml-2 text-gray-700">Chargement...</span>
					</div>
				) : vacances.length === 0 ? (
					<div className='flex items-center gap-3 p-3'>
						<div className="flex items-center justify-center gap-2">
							<Info className='w-4 h-4 text-red-800' />
							<span className="ml-2 text-gray-700">Aucune donnée trouvée !</span>
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
					filteredVacances.map(vac => (
						<div key={vac.id} className="bg-white rounded-xl border border-gray-200 p-3">
							<div className="flex items-center justify-between">
								<div className='flex items-center gap-3'>
									<div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
										<span className="text-sm font-medium text-blue-700">
											{
												(vac.nom).split(' ').map(n => n[0]).join('')
											}
										</span>
									</div>
									<div>
										<p className="text-2xl font-bold text-gray-900 mt-1">{vac.nom}</p>
										<p className="text-sm font-medium text-gray-600">A partir du {formatDate(vac.dateDebut)}</p>
										<p className="text-sm font-medium text-gray-600">Fin : {formatDate(vac.dateFin)}</p>
									</div>
								</div>
								<button
									onClick={() => handleDelete(vac.id)}
									className="flex items-center gap-2 cursor-pointer px-2 py-2 bg-red-50 text-black rounded-lg hover:bg-red-700 hover:text-white transition-colors"
								>
									<Trash2 className="w-4 h-4" />
								</button>
							</div>
						</div>
					))
				)}
			</div>
		</div>
	)
}