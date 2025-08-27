'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from 'recharts';

export default function CongesAreaChart() {
	const [data, setData] = useState([]);

	useEffect(() => {
		const fetchConges = async () => {
			try {
				const res = await fetch('/api/conges/chart');
				const json = await res.json();
				setData(Array.isArray(json) ? json : []);
			} catch (error) {
				console.error('Erreur lors du chargement des congés :', error);
			}
		};

		fetchConges();
	}, []);

	if (data.length === 0) return (
		<div className="flex flex-col items-center justify-center p-10 bg-gradient-to-r from-gray-100 via-gray-300 to-gray-100 rounded-xl border border-gray-200">
			{/* Illustration */}
			<Image
				src="/images/verf.svg" // Remplace par le chemin de ton image ou SVG
				alt="Vérification des dépenses"
				width={300} height={300}
				className="w-40 h-40 mb-6"
			/>

			{/* Texte */}
			<p className="text-black text-center text-2xl font-medium">
				Conseils
			</p>
			<p className="text-gray-700 text-center text-md">
				Vérifiez les demandes de congés de temps en temps pour rester à jour !
			</p>
			<p className="text-gray-700 text-center text-md">
				Un graphique s&apos;affichera si vous validez des congés
			</p>
		</div>
	);

	return (
		<div className="bg-white p-6 rounded-xl border border-gray-200 w-full">
			<h2 className="text-lg font-semibold mb-4 text-gray-800">Congés mensuels</h2>
			<ResponsiveContainer width="100%" height={300}>
				<AreaChart
					data={data}
					margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
				>
					<defs>
						<linearGradient id="colorConge" x1="0" y1="0" x2="0" y2="1">
							<stop offset="5%" stopColor="#EB9F04" stopOpacity={0.8} />
							<stop offset="95%" stopColor="#EB9F04" stopOpacity={0} />
						</linearGradient>
					</defs>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="mois" />
					<YAxis allowDecimals={false} />
					<Tooltip formatter={(value) => `${value} jour(s)`} />
					<Area
						type="monotone"
						dataKey="nombre"
						stroke="#EB9F04"
						fillOpacity={1}
						fill="url(#colorConge)"
					/>
				</AreaChart>
			</ResponsiveContainer>
		</div>
	);
}
