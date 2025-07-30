'use client';

import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image'
import Link from 'next/link';
import { Home, Bell, HandCoins, MailQuestion, TreePalm, UserCog, Loader2 } from 'lucide-react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { useEffect, useState } from 'react';

const navigation = [
	{ name: 'Home', href: '/employee/home', icon: Home },
	{ name: 'Dépenses', href: '/employee/depenses', icon: HandCoins },
	{ name: 'Client & Projets', href: '/employee/clientsprojets', icon: UserCog },
	{ name: 'Demande de congés', href: '/employee/conges', icon: MailQuestion },
];

function classNames(...classes) {
	return classes.filter(Boolean).join(' ')
}

export default function Header() {
	const pathname = usePathname();
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	const isActive = (href) => pathname.startsWith(href);
	const router = useRouter()

	const setShowNotifs = () => {
		router.push('/dashboard/notifications')
	};

	useEffect(() => {
		fetch('/api/auth/currentUser')
			.then(res => res.json())
			.then(data => {
				setUser(data.user);
				setLoading(false);
			});
	}, []);

	const handleLogout = async () => {
		await fetch('/api/auth/logout');
		router.push('/auth/login');
	};

	return (
		<div className="bg-white sticky top-0 z-50 border-b border-gray-200">
			<div className="w-full px-5">
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
							<span className='text-blue-600 font-bold text-xl sm:block hidden'>Teamo</span>
							<div className="flex items-center gap-3 pl-4 border-l border-gray-200">
								<div className="text-right flex items-center justify-center">
									<p className="text-sm font-medium text-gray-900">
										{loading ? (<span className="text-sm animate-pulse">Wait...</span>) : user ? user.nom : 'Non connecté'}
									</p>
								</div>
								<div className="bg-blue-100 px-3 py-1 rounded-full flex items-center justify-center">
									<p className="text-sm text-black capitalize">{loading ? (<Loader2 className="h-4 w-4 animate-spin" />) : user ? user.poste : 'Employé'}</p>
								</div>
							</div>
						</div>

						<div className="flex items-center gap-2">
							<button key='/dashboard/notifications' onClick={() => setShowNotifs()}
								className={`px-2 py-2 cursor-pointer border border-gray-200 rounded-full transition-all ${isActive('/dashboard/notifications')
									? 'bg-orange-200 text-black'
									: 'bg-white text-black hover:bg-gray-100'
									}`}>
								<Bell className="w-5 h-5" />
							</button>

							<div className="flex items-center pl-2 border-l border-gray-200">
								{/* Profile dropdown */}
								<Menu as="div" className="relative">
									<MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-hidden focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800">
										<span className="absolute -inset-1.5" />
										<span className="sr-only">Open user menu</span>
										<div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
											<span className="text-sm font-medium text-teal-700">
												{loading ? (<Loader2 className="h-4 w-4 animate-spin" />) : user ? (user.nom + " " + user.prenom).split(' ').map(n => n[0]).join('') : 'X'}
											</span>
										</div>
									</MenuButton>

									<MenuItems
										transition
										className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
									>
										<MenuItem>
											<span className="block px-4 py-2 text-sm text-orange-700 data-focus:bg-gray-100 data-focus:outline-hidden">
												{loading ? (<Loader2 className="h-4 w-4 animate-spin" />) : user ? (user.nom + " " + user.prenom) : 'Non connecté'}
											</span>
										</MenuItem>
										<MenuItem>
											<a
												href="#"
												className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
											>
												Mon Profil
											</a>
										</MenuItem>
										<MenuItem>
											<button
												type='button'
												onClick={() => { handleLogout() }}
												className="block w-full px-4 py-2 text-md font-bold cursor-pointer bg-red-100 text-red-700 data-focus:bg-gray-100 data-focus:outline-hidden"
											>
												Déconnexion
											</button>
										</MenuItem>
									</MenuItems>
								</Menu>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="w-full px-5">
				<div className="flex items-center">
					<div className=" overflow-hidden h-full">
						<div className="flex items-center h-full space-x-4 overflow-x-auto whitespace-nowrap scrollable">
							{navigation.map((item) => {
								const Icon = item.icon;
								return (
									<div className='flex flex-col items-center justify-center transition-all duration-150' key={item.name}>
										<Link
											href={item.href}
											aria-current={isActive(item.href) ? 'page' : undefined}
											className='flex items-center mb-1 rounded-lg gap-2 px-3 py-2 text-sm font-medium transition-colors duration-150 text-gray-700 hover:bg-gray-100 hover:text-gray-900'
										>
											<Icon size={16} />
											{item.name}
										</Link>
										<span
											className={classNames(
												isActive(item.href)
													? 'border-blue-600 text-blue-800 font-semibold'
													: 'border-none ',
												'border-b  transition-all w-full duration-150'
											)}>
										</span>
									</div>
								);
							})}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}