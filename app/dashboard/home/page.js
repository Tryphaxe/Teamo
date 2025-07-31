"use client";

import React, { useEffect, useState } from 'react'
import { Users, DollarSign, Receipt, Calendar, TrendingUp, AlertCircle } from 'lucide-react';
import { fetchEmployes } from '@/lib/api/apiEmploye';
import { fetchDepenses } from '@/lib/api/apiDepense';
import { fetchConges } from '@/lib/api/apiConge';

export default function Page() {
	const [employes, setEmployes] = useState([]);
	const [depenses, setDepenses] = useState([]);
	const [conges, setConges] = useState([]);
	const [isloading, setIsLoading] = useState(true);

	//  Récupération fetch
	useEffect(() => {
		fetchEmployes(setEmployes, setIsLoading);
		fetchDepenses(setDepenses, setIsLoading);
		fetchConges(setConges, setIsLoading);
	}, []);

	//  Récupération count
	const totalEmployes = employes.length;
	const depensesAttente = depenses.filter(d => d.statut === 'EN_ATTENTE').length;
	const congesAttente = conges.filter(c => c.statut === 'EN_ATTENTE').length;

	const stats = [
		{
			title: 'Employés',
			value: totalEmployes,
			icon: Users,
			color: 'bg-blue-500',
			bgColor: 'bg-blue-50',
			textColor: 'text-blue-700'
		},
		{
			title: 'Dépenses en attente',
			value: depensesAttente,
			icon: AlertCircle,
			color: 'bg-orange-500',
			bgColor: 'bg-orange-50',
			textColor: 'text-orange-700'
		},
		{
			title: 'Congés en attente',
			value: congesAttente,
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

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
				{stats.map((stat, index) => {
					const Icon = stat.icon;
					return (
						<div key={index} className="bg-white rounded-xl border border-gray-200 p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-600">{stat.title}</p>
									{isloading ? (<p className="text-2xl font-bold text-gray-900 mt-1 px-2 py-3 bg-gray-200 rounded animate-pulse"></p>) : (<p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>)}
								</div>
								<div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
									<Icon className={`w-6 h-6 ${stat.textColor}`} />
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	)
}
