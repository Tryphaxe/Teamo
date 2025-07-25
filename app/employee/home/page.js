"use client"

import React, { useState } from 'react';
import { Plus, Calendar, DollarSign, Receipt, User, TrendingUp } from 'lucide-react';

export default function Page() {
	const [showExpenseForm, setShowExpenseForm] = useState(false);
	const status = 'approved';
	const emp = 1

	return (
		<div className='p-6 space-y-6'>
			{/* En-tête de bienvenue */}
			<div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl p-6 text-white">
				<h1 className="text-2xl font-bold mb-2">Bonjour, {"Defta".split(' ')[0]} !</h1>
				<p className="text-teal-100">Voici un aperçu de votre espace personnel</p>
			</div>

			{/* Informations personnelles */}
			<div className="bg-white rounded-xl border border-gray-200 p-6">
				<div className="flex items-center gap-4 mb-4">
					<div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center">
						<User className="w-8 h-8 text-teal-600" />
					</div>
					<div>
						<h2 className="text-xl font-semibold text-gray-900">Defta King</h2>
						<p className="text-gray-600">Comptable Senior</p>
						<p className="text-sm text-gray-500">Comptabilité</p>
					</div>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
					<div>
						<p className="text-sm text-gray-500">Email</p>
						<p className="font-medium">defta.king@gmail.com</p>
					</div>
					<div>
						<p className="text-sm text-gray-500">Département</p>
						<p className="font-medium">Comptabilité</p>
					</div>
				</div>
			</div>

			{/* Mes dépenses */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200">
				<div className="p-6 border-b border-gray-200">
					<div className="flex items-center justify-between">
						<h3 className="text-lg font-semibold text-gray-900">Mes Dépenses</h3>
						<button
							onClick={() => setShowExpenseForm(true)}
							className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
						>
							<Plus className="w-4 h-4" />
							Ajouter une dépense
						</button>
					</div>
				</div>

				{showExpenseForm && (
					<div className="p-6 border-b border-gray-200 bg-gray-50">
						<form className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Montant (€)
									</label>
									<input
										type="number"
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
										required
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Catégorie
									</label>
									<select
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
									>
										<option value="Matériel">Matériel</option>
										<option value="Formation">Formation</option>
										<option value="Repas">Repas</option>
										<option value="Transport">Transport</option>
										<option value="Autre">Autre</option>
									</select>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Description
									</label>
									<input
										type="text"
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
									Ajouter
								</button>
								<button
									type="button"
									onClick={() => setShowExpenseForm(false)}
									className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
								>
									Annuler
								</button>
							</div>
						</form>
					</div>
				)}

				<div className="p-6">
					{emp === 0 ? (
						<div className="text-center py-8 text-gray-500">
							<Receipt className="w-12 h-12 mx-auto mb-3 text-gray-300" />
							<p>Aucune dépense enregistrée</p>
						</div>
					) : (
						<div className="space-y-3">
							<div key="1" className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
								<div className="flex-1">
									<div className="flex items-center gap-3">
										<div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
											<Receipt className="w-5 h-5 text-orange-600" />
										</div>
										<div>
											<p className="font-medium text-gray-900">Formation React Advanced</p>
											<p className="text-sm text-gray-500">Formation • 2024-01-15</p>
										</div>
									</div>
								</div>
								<div className="text-right">
									<p className="font-semibold text-gray-900">500 000Fcfa</p>
									<span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${status === 'approved' ? 'bg-green-100 text-green-800' :
										status === 'rejected' ? 'bg-red-100 text-red-800' :
											'bg-yellow-100 text-yellow-800'
										}`}>
										{status === 'approved' ? 'Approuvé' :
											status === 'rejected' ? 'Refusé' : 'En attente'}
									</span>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
