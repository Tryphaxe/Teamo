'use client';

import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

dayjs.locale('fr');

export default function PresenceHeader({ onDateChange }) {
	const [currentDate, setCurrentDate] = useState(dayjs());

	const formattedDate = currentDate.format('dddd DD MMMM YYYY');

	const changeDate = (direction) => {
		const newDate = direction === 'prev'
			? currentDate.subtract(1, 'day')
			: currentDate.add(1, 'day');

		setCurrentDate(newDate);
		onDateChange(newDate);
	};

	useEffect(() => {
		onDateChange(currentDate); // appel initial
	}, []);

	return (
		<div className="flex items-center justify-between py-2 px-3 bg-white border border-gray-200 rounded-lg">
			<motion.button
				whileTap={{ scale: 0.9 }}
				className="p-2 rounded-full hover:bg-gray-200 transition"
				onClick={() => changeDate('prev')}
			>
				<ArrowLeft className="w-6 h-6 text-gray-600" />
			</motion.button>

			<motion.div
				key={formattedDate}
				initial={{ opacity: 0, y: -10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3 }}
			>
				<h2 className="text-xl font-semibold text-gray-800">
					{formattedDate}
				</h2>
			</motion.div>

			<motion.button
				whileTap={{ scale: 0.9 }}
				className="p-2 rounded-full hover:bg-gray-200 transition"
				onClick={() => changeDate('next')}
			>
				<ArrowRight className="w-6 h-6 text-gray-600" />
			</motion.button>
		</div>
	);
}