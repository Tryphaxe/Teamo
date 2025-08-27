'use client';
import { Loader, LoaderPinwheel } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from 'recharts';

export default function MyBar() {
	const [data, setData] = useState([]);

	useEffect(() => {
		const fetchDepenses = async () => {
			try {
				const res = await fetch('/api/depenses/chart');
				const json = await res.json();
				setData(json);
			} catch (error) {
				console.error('Erreur lors du chargement des données :', error);
			}
		};

		fetchDepenses();
	}, []);
	if (data.length === 0) return (
		<div className="flex flex-col items-center justify-center p-10 bg-gradient-to-r from-gray-100 via-gray-300 to-gray-100 rounded-xl border border-gray-200">
			{/* Illustration */}
			<LoaderPinwheel className='w-25 h-25 animate-spin text-orange-800' />

			{/* Texte */}
			<p className="text-black text-center text-2xl font-medium">
				Conseils
			</p>
			<p className="text-gray-700 text-center text-md">
				Vérifiez les dépenses de temps en temps pour rester à jour !
			</p>
			<p className="text-gray-700 text-center text-md">
				Un graphique s&apos;affichera si vous validez des dépenses !
			</p>
		</div>
	);
	return (
		<div className="bg-white p-6 rounded-xl border border-gray-200 w-full">
			<h2 className="text-lg font-semibold mb-4 text-gray-800">Dépenses mensuelles (validées)</h2>
			<ResponsiveContainer width="100%" height={300}>
				<BarChart
					data={data}
					margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
				>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="mois" />
					<YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
					<Tooltip
						formatter={(value) => `${value.toLocaleString()} FCFA`}
						labelFormatter={(label) => `Mois : ${label}`}
					/>
					<Bar dataKey="montant" fill="#EB9F04" radius={[10, 10, 0, 0]} />
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
}
