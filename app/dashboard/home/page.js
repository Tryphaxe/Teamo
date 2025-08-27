"use client";

import React, { useCallback, useEffect, useState } from 'react'
import { Users, Calendar, AlertCircle, Search, ListFilter, User, Timer, Radius, Info, RefreshCw } from 'lucide-react';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/20/solid'
import { fetchEmployes } from '@/lib/api/apiEmploye';
import { fetchDepenses } from '@/lib/api/apiDepense';
import { fetchConges } from '@/lib/api/apiConge';
import { formatDate, getFormattedDate, getHeureFromDate } from '@/lib/date';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import MyBar from '@/components/BarChart';
import CongesAreaChart from '@/components/AreaChart';

export default function Page() {
	const [employes, setEmployes] = useState([]);
	const [depenses, setDepenses] = useState([]);
	const [conges, setConges] = useState([]);
	const [presences, setPresences] = useState([]);
	const [isloading, setIsLoading] = useState(true);
	const [loading, setLoading] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedDate, setSelectedDate] = useState(getFormattedDate());
	const today = format(new Date(), 'yyyy-MM-dd');

	// fetch présence
	const fetchPresence = useCallback(async () => {
		setLoading(true);
		try {
			const res = await fetch(`/api/presences?date=${selectedDate}`);
			const data = await res.json();
			setPresences(data);
		} catch (error) {
			toast.error("Erreur chargement");
		} finally {
			setLoading(false);
		}
	}, [selectedDate]);

	//  Récupération fetch
	useEffect(() => {
		fetchEmployes(setEmployes, setIsLoading);
		fetchDepenses(setDepenses, setIsLoading);
		fetchConges(setConges, setIsLoading);
		fetchPresence();
	}, [fetchPresence]);

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

	const filtres = [
		{ id: null, nom: 'Choisir...' },
		{ id: '0', nom: 'Absent' },
		{ id: '1', nom: 'Présent' },
	];
	const [selectedAp, setSelectedAp] = useState(filtres[0]);

	const filteredPresences = presences.filter((pres) => {
		const fullName = `${pres.nom} ${pres.prenom}`.toLowerCase();
		const matchesSearch = fullName.includes(searchTerm.toLowerCase());
		const matchesAp =
			selectedAp.id === null
				? true
				: pres.present === (selectedAp.id === '1');
		return matchesSearch && matchesAp;
	});

	return (
		<div>
			<div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white mb-3">
				<h1 className="text-2xl font-bold mb-2">Tableau de bord administrateur</h1>
				<p className="text-blue-100">Vue d&apos;ensemble de la gestion des employés</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
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

			<div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
				<MyBar />
				<CongesAreaChart />
			</div>

			<div className="flex items-center justify-between bg-gradient-to-r from-white to-gray-50 rounded-lg px-6 py-2 text-black mb-3">
				<h1 className="text-md sm:text-xl font-medium">Liste de présences</h1>
				<button
					title="Actualiser"
					onClick={fetchPresence}
					className="flex items-center cursor-pointer border border-gray-300 gap-2 p-2 bg-gray-100 text-black rounded-lg hover:bg-gray-200 transition-colors"
				>
					<RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
				</button>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4 p-1">
				<div>
					<input
						type="date"
						id="date"
						value={selectedDate}
						max={today}
						onChange={(e) => setSelectedDate(e.target.value)}
						className="border px-3 py-2 rounded-md w-full bg-white border-gray-200 h-full"
					/>
				</div>

				{/* Champ de recherche */}
				<div className="bg-white rounded-md border border-gray-300 flex items-center gap-x-3 px-3 py-2 w-full">{/* Champ de tri */}
					<Listbox value={selectedAp} onChange={setSelectedAp}>
						<div className="relative text-black">
							<ListboxButton className="cursor-pointer p-2 rounded-md bg-white text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6">
								{/* <span className="flex items-center gap-3 pr-6">
								<span className="hidden">{selectedDept ? selectedDept.nom : 'Tous les départements'}</span>
							</span> */}
								<ListFilter size={20} color="#333" />
							</ListboxButton>

							<ListboxOptions
								transition
								className="absolute z-10 mt-1 max-h-56 min-w-max overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-hidden data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:text-sm"
							>
								{filtres.map((ap) => (
									<ListboxOption
										key={ap.id ?? 'all'}
										value={ap}
										className="group relative cursor-default py-2 pr-9 pl-3 text-gray-900 select-none data-focus:bg-blue-600 data-focus:text-white data-focus:outline-hidden"
									>
										<div className="flex items-center min-w-max">
											<span className="ml-3 block truncate font-normal group-data-selected:font-semibold">{ap.nom}</span>
										</div>

										<span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600 group-not-data-selected:hidden group-data-focus:text-white">
											<CheckIcon aria-hidden="true" className="size-5" />
										</span>
									</ListboxOption>
								))}
							</ListboxOptions>
						</div>
					</Listbox>
					<Search size={15} color="gray" />
					<input
						type="text"
						placeholder="Rechercher employé..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="bg-transparent w-full border-none outline-none ring-0 focus:ring-0 focus:border-none focus:outline-none"
					/>
				</div>
			</div>

			{isloading ? (
				<div className="flex items-center justify-center gap-3 p-3">
					<Radius className='animate-spin w-4 h-4 text-blue-950' />
					<span className="ml-2 text-gray-700">Chargement...</span>
				</div>
			) : presences.length === 0 ? (
				<div className='flex flex-col items-center justify-center gap-3 p-3'>
					<div className="flex items-center justify-center gap-3">
						<Info className='w-4 h-4 text-red-800' />
						<span className="ml-2 text-gray-700">Aucune présence trouvée !</span>
					</div>
				</div>
			) : (
				<ul role="list" className="divide-y divide-gray-100 bg-white px-4">
					{filteredPresences.map(pres => (
						<li key={pres.id} className="flex justify-between gap-x-6 py-5">
							<div className="flex min-w-0 gap-x-4">
								<div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
									<User className="w-5 h-5 text-blue-600" />
								</div>
								<div className="min-w-0 flex-auto">
									<p className="text-sm font-semibold text-gray-900">{pres.nom + " " + pres.prenom}</p>
									<p className="mt-1 truncate text-sm/5 text-gray-500">{pres.email}</p>
								</div>
							</div>
							<div className="shrink-0 flex items-center gap-2">
								<p className="text-sm/6 text-gray-900 flex items-center rounded-full p-1 border border-gray-200 bg-gray-50"><Timer className='w-5 h-5' />&nbsp;{getHeureFromDate(pres.date)}</p>
								<p>|</p>
								{pres.present === false
									? (
										<span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-md font-medium text-red-700 ring-1 ring-red-600/20 ring-inset">
											Absent
										</span>
									)
									: (
										<span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-md font-medium text-green-700 ring-1 ring-green-600/20 ring-inset">
											Présent
										</span>
									)
								}
							</div>
						</li>
					))}
				</ul>
			)}
		</div>
	)
}
