"use client";

import React, { useState, useEffect } from 'react'
import { Upload } from 'lucide-react';
import { handleExport } from '@/utils/exportation';

export default function Page() {
	const exportItems = [
		{ title: "Employés", icon: "👨‍💼" },
		{ title: "Dépenses", icon: "💰" },
		{ title: "Clients", icon: "👥" },
		{ title: "Projets", icon: "📁" },
		{ title: "Demandes de congés", icon: "📝" },
	];

	return (
		<div className="max-w-6xl mx-auto px-4 py-10">
			<h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center"><Upload className='mr-2'/>Exportation des données</h1>
			<p className="text-gray-600 mb-8">
				Cliquez sur un bouton pour exporter les données correspondantes au format PDF ou Excel.
			</p>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{exportItems.map((item) => (
					<div
						key={item.title}
						className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between border border-gray-100 hover:shadow-lg transition"
					>
						<div className="flex items-center gap-3 mb-4">
							<span className="text-3xl">{item.icon}</span>
							<h2 className="text-lg font-semibold text-gray-800">{item.title}</h2>
						</div>

						<div className="flex gap-3 mt-auto">
							<button onClick={() => handleExport(item.title, "pdf")} className="flex-1 cursor-pointer bg-blue-600 text-white text-sm py-2 rounded hover:bg-blue-700 transition">
								Exporter PDF
							</button>
							<button onClick={() => handleExport(item.title, "excel")} className="flex-1 cursor-pointer bg-green-600 text-white text-sm py-2 rounded hover:bg-green-700 transition">
								Exporter Excel
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}