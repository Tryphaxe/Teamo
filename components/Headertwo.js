'use client';

import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image'
import Link from 'next/link';
import { Home, Users, Settings, Bell, LogOut, Group, HandCoins, ShieldUser, MailQuestion, TreePalm, UserCog } from 'lucide-react';

const setShowNotifs = () => {
	router.push('/notifications')
};
const setShowSettings = () => {
	router.push('/parametres')
};
const boutons = [
	{ href: '/dashboard/notifications', icon: Bell, onClick: () => setShowNotifs() },
	{ href: '/dashboard/parametres', icon: Settings, onClick: () => setShowSettings() },
];

function classNames(...classes) {
	return classes.filter(Boolean).join(' ')
}

export default function Headertwo() {
	const pathname = usePathname();

	const isActive = (href) => pathname.startsWith(href);
	const userName = 'King Defta';
	const router = useRouter()

	const setShowHome = () => {
		router.push('/employee/home')
	};
	const setShowNotifs = () => {
		router.push('/employee/notifications')
	};
	const setShowSettings = () => {
		router.push('/employee/parametres')
	};
	const boutons = [
		{ href: '/employee/home', icon: Home, onClick: () => setShowHome() },
		{ href: '/employee/notifications', icon: Bell, onClick: () => setShowNotifs() },
		{ href: '/employee/parametres', icon: Settings, onClick: () => setShowSettings() },
	];

	return (
		<div className="bg-white sticky top-0 z-50 shadow-sm">
			<div className="w-full px-10 border-b border-gray-200">
				<div className="flex h-16 items-center">
					<div className="flex items-center justify-between w-full">
						<div className="shrink-0 flex items-center gap-4">
							<Image
								alt="Teamo logo"
								src="/timo.png"
								width={60}
								height={60}
								className="h-8 w-auto"
							/>
							<span className='text-teal-600 font-bold text-xl'>Teamo</span>
						</div>

						<div className="flex items-center gap-4">
							{boutons.map((item) => {
								const Icon = item.icon;
								return (
									<button key={item.href} onClick={item.onClick}
										className={`px-2 py-2 cursor-pointer rounded-lg transition-all ${isActive(item.href)
											? 'bg-orange-600 text-white'
											: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
											}`}>
										<Icon className="w-5 h-5" />
									</button>
								);
							})}

							<div className="flex items-center gap-3 pl-4 border-l border-gray-200">
								<div className="text-right">
									<p className="text-sm font-medium text-gray-900">King Defta</p>
									<p className="text-xs text-gray-500 capitalize">Employé</p>
								</div>
								<div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
									<span className="text-sm font-medium text-teal-700">
										{
											userName.split(' ').map(n => n[0]).join('')
										}
									</span>
								</div>
							</div>

							<button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
								<LogOut className="w-5 h-5" />
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}