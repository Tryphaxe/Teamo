"use client";

import React, { useState, useEffect } from 'react'
import { Info, Plus, Radius, Trash2 } from 'lucide-react';
import { deleteDepartement, fetchDepartements, submitForm } from '@/lib/api/apiDepartement';

export default function Page() {
	const [showForm, setShowForm] = useState(false);
	const [loading, setLoading] = useState(false)
	const [departements, setDepartements] = useState([])
	const [isloading, setIsLoading] = useState(true)

	const [form, setForm] = useState({
		nom: '',
	});
	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	useEffect(() => {
		fetchDepartements(setDepartements, setIsLoading);
	}, []);

	// Fonction pour enregistrer un nouveau departement
	const handleSubmit = async (e) => {
		e.preventDefault();
		await submitForm({
			data: form,
			setLoading,
			setShowForm,
			reload: () => fetchDepartements(setDepartements, setIsLoading),
			successMessage: "Departement ajouté avec succès.",
			errorMessage: "Erreur lors de l'ajout du departement.",
		});
	};

	return (
		<div>
			{showForm && (
				<div className="bg-white rounded-xl border border-gray-200 p-6 mb-2">
					<h3 className="text-lg font-semibold text-gray-900 mb-4">
						Nouveau département
					</h3>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label htmlFor='nom' className="block text-sm font-medium text-gray-700 mb-1">
									Nom du département
								</label>
								<input
									type="text"
									id="nom"
									value={form.nom} onChange={handleChange}
									className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
									required
								/>
							</div>
						</div>
						<div className="flex gap-2">
							<button
								type="submit"
								disabled={loading}
								className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
							>
								{loading ? 'Ajout en cours...' : 'Ajouter'}
							</button>
							<button
								type="button"
								className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
							>
								Annuler
							</button>
						</div>
					</form>
				</div>
			)}

			<div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-2">
				<h1 className="text-xl font-medium text-gray-900">Gestion des départements</h1>
				<button
					onClick={() => setShowForm(true)}
					className="flex items-center gap-2 cursor-pointer px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
				>
					<Plus className="w-4 h-4" />
					Ajouter
				</button>
			</div>
			{isloading ? (
				<div className="flex items-center justify-center gap-3 p-3">
					<Radius className='animate-spin w-4 h-4 text-teal-950' />
					<span className="ml-2 text-gray-700">Chargement des départements...</span>
				</div>
			) : departements.length === 0 ? (
				<div className='flex flex-col items-center justify-center gap-3 p-3'>
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
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
					{departements.map((dep) => (
						<div key={dep.nom} className="bg-white rounded-xl border border-gray-200 p-3">
							<div className="flex items-center justify-between">
								<div className='flex items-center gap-3'>
									<div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
										<span className="text-sm font-medium text-teal-700">
											{
												(`${dep.nom}`).split(' ').map(n => n[0]).join('')
											}
										</span>
									</div>
									<div>
										<p className="text-sm font-medium text-gray-600">
											{dep._count.employes} employé(s)
										</p>
										<p className="text-xl font-bold text-gray-900 mt-1">{dep.nom}</p>
									</div>
								</div>
								<button
									onClick={() => deleteDepartement(dep.id, fetchDepartements)}
									className="flex items-center gap-2 cursor-pointer px-2 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
								>
									<Trash2 className="w-4 h-4" />
								</button>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	)
}