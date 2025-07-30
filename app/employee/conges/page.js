import { Check, Filter, Upload, User, X } from 'lucide-react'
import React from 'react'

export default function page() {
	return (
		<div>
			<div className="flex items-center justify-between mb-3">
				<h1 className="text-2xl font-bold text-gray-900">Gestion des congés</h1>
				<div className="flex items-center gap-2 rounded-lg bg-white border border-gray-300 px-4 py-2">
					<Filter className="w-4 h-4 text-gray-500" />
					<select
						className="border-none focus:ring-0 focus:ring-none focus:border-transparent text-black"
					>
						<option value="all">Toutes les dépenses</option>
						<option value="pending">En attente</option>
						<option value="approved">Approuvées</option>
						<option value="rejected">Refusées</option>
					</select>
				</div>
			</div>

			{/* Statistiques */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
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
					<p className="text-sm text-gray-600">Réfusées</p>
					<p className="text-2xl font-bold text-gray-900">10</p>
				</div>
			</div>

			<div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
				<div className="p-6 border-b border-gray-200 flex items-center justify-between">
					<h3 className="text-lg font-semibold text-gray-900">Demande de congés</h3>
					<button
						className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
					>
						<Upload className="w-4 h-4" />
						Exporter
					</button>
				</div>
				<div className="overflow-x-auto custom-scrollbar">
					<table className="w-full">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Employé
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Description
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Catégorie
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
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							<tr key="1" className="hover:bg-gray-50">
								<td className="px-6 py-4 whitespace-nowrap">
									<div className="flex items-center gap-3">
										<div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
											<span className="text-sm font-medium text-teal-700">
												{
													("Kone").split(' ').map(n => n[0]).join('')
												}
											</span>
										</div>
										<div>
											<p className="font-medium text-gray-900">Kone</p>
											<p className="text-sm text-gray-500">Kone@gmail.com</p>
										</div>
									</div>
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
									Serveur
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
									Informatique
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
									46000
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
									05/07/2025
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
									<span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-300">
										Accepté
									</span>
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
									<div className="flex gap-2">
										<button
											className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
										>
											<Check className="w-3 h-3" />
											Approuver
										</button>
										<button
											className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
										>
											<X className="w-3 h-3" />
											Refuser
										</button>
									</div>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	)
}