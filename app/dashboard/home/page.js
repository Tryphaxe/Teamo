import React from 'react'
import { Users, DollarSign, Receipt, Calendar, TrendingUp, AlertCircle } from 'lucide-react';

export default function page() {
	const totalBudgetAllocated = 1000000;
	const totalBudgetUsed = 750000;
	const stats = [
		{
			title: 'Employés',
			value: 530,
			icon: Users,
			color: 'bg-blue-500',
			bgColor: 'bg-blue-50',
			textColor: 'text-blue-700'
		},
		{
			title: 'Dépenses en attente',
			value: 150,
			icon: AlertCircle,
			color: 'bg-orange-500',
			bgColor: 'bg-orange-50',
			textColor: 'text-orange-700'
		},
		{
			title: 'Budget total alloué',
			value: `${totalBudgetAllocated.toLocaleString()}€`,
			icon: DollarSign,
			color: 'bg-green-500',
			bgColor: 'bg-green-50',
			textColor: 'text-green-700'
		},
		{
			title: 'Congés en attente',
			value: 10,
			icon: Calendar,
			color: 'bg-purple-500',
			bgColor: 'bg-purple-50',
			textColor: 'text-purple-700'
		}
	];


	return (
		<div>
			<div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl p-6 text-white mb-3">
				<h1 className="text-2xl font-bold mb-2">Tableau de bord administrateur</h1>
				<p className="text-teal-100">Vue d&apos;ensemble de la gestion des employés</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
				{stats.map((stat, index) => {
					const Icon = stat.icon;
					return (
						<div key={index} className="bg-white rounded-xl border border-gray-200 p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-600">{stat.title}</p>
									<p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
								</div>
								<div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
									<Icon className={`w-6 h-6 ${stat.textColor}`} />
								</div>
							</div>
						</div>
					);
				})}
			</div>

			{/* Graphique d'utilisation du budget */}
			<div className="bg-white rounded-xl border border-gray-200 p-6">
				<h3 className="text-lg font-semibold text-gray-900 mb-4">Utilisation du budget</h3>
				<div className="space-y-4">
					<div className="flex justify-between text-sm">
						<span className="text-gray-600">Budget utilisé</span>
						<span className="font-medium text-black">{totalBudgetUsed.toLocaleString()}€ / {totalBudgetAllocated.toLocaleString()}€</span>
					</div>
					<div className="w-full bg-gray-200 rounded-full h-3">
						<div
							className="bg-gradient-to-r from-teal-500 to-orange-500 h-3 rounded-full transition-all duration-300"
							style={{ width: `${(totalBudgetUsed / totalBudgetAllocated) * 100}%` }}
						></div>
					</div>
					<p className="text-xs text-gray-500">
						{((totalBudgetUsed / totalBudgetAllocated) * 100).toFixed(1)}% du budget total utilisé
					</p>
				</div>
			</div>
		</div>
	)
}
