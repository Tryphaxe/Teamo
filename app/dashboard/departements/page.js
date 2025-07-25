"use client";

import React, { useState, useEffect } from 'react'
import { Info, Plus, Radius, Trash2 } from 'lucide-react';
import axios from 'axios'
import toast from 'react-hot-toast'

export default function Page() {
	const [showForm, setShowForm] = useState(false);
	const [nom, setNom] = useState('')
	const [loading, setLoading] = useState(false)
	const [departements, setDepartements] = useState([])
	const [isloading, setIsLoading] = useState(true)

	// Fonction pour récupérer la liste des départements
	const fetchDepartements = async () => {
		try {
			const res = await axios.get('/api/departements')
			setDepartements(res.data)
		} catch (error) {
			toast.error('Erreur lors du chargement des départements.')
		} finally {
			setIsLoading(false)
		}
	}
	useEffect(() => {
		fetchDepartements()
	}, [])

	// Handler pour soumettre le formulaire
	const handleSubmit = async (e) => {
		e.preventDefault()
		setLoading(true)

		const toastId = toast.loading('Ajout du département...')

		try {
			const res = await axios.post('/api/departements', { nom })

			toast.success(`Département "${res.data.nom}" ajouté avec succès.`, { id: toastId })
			setNom('')
		} catch (error) {
			const msg = error.response?.data?.error || 'Erreur inconnue'
			toast.error(msg, { id: toastId })
		} finally {
			setLoading(false)
			setShowForm(false)
			fetchDepartements() // Recharger la liste des départements
		}
	}

	// Fonction pour supprimer un département
	const handleDelete = async (id) => {
		const confirm = window.confirm('Supprimer ce département ?')
		if (!confirm) return

		const toastId = toast.loading('Suppression en cours...')

		try {
			await axios.delete(`/api/departements/${id}`)
			toast.success('Département supprimé.', { id: toastId })
			setDepartements((prev) => prev.filter((dep) => dep.id !== id))
		} catch (error) {
			toast.error('Erreur lors de la suppression.', { id: toastId })
		}
	}

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

			<div className="flex items-center justify-between mb-4">
				<h1 className="text-2xl font-bold text-gray-900">Gestion des départements</h1>
				<button
					onClick={() => setShowForm(true)}
					className="flex items-center gap-2 cursor-pointer px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
				>
					<Plus className="w-4 h-4" />
					Ajouter un département
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
									onClick={() => handleDelete(dep.id)}
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