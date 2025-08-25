'use client';

import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Home, Users, Settings, Bell, Group, HandCoins, ShieldUser, MailQuestion, TreePalm, UserCog, Loader2 } from 'lucide-react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, TransitionChild } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

import { useNotifications } from './useNotifications';

const navigation = [
	{ name: 'Home', href: '/dashboard/home', icon: Home },
	{ name: 'Employés', href: '/dashboard/employes', icon: Users },
	{ name: 'Départements', href: '/dashboard/departements', icon: Group },
	{ name: 'Dépenses', href: '/dashboard/depenses', icon: HandCoins },
	{ name: 'Client & Projets', href: '/dashboard/clientsprojets', icon: UserCog },
	{ name: 'Demande de congés', href: '/dashboard/conges', icon: MailQuestion },
	{ name: 'Admin', href: '/dashboard/admin', icon: ShieldUser },
];

function classNames(...classes) {
	return classes.filter(Boolean).join(' ')
}

export default function Header() {
	const pathname = usePathname();
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [openDra, setOpenDra] = useState(false);
	const { notifs, nonluCount, markAllAsRead, markAsRead } = useNotifications();

	const isActive = (href) => pathname.startsWith(href);
	const router = useRouter()

	const setShowSettings = () => {
		router.push('/dashboard/parametres')
	};
	const boutons = [
		{ href: '/dashboard/parametres', icon: Settings, onClick: () => setShowSettings() },
	];

	// Initialisation user + notifications
	useEffect(() => {
		const init = async () => {
			const res = await fetch('/api/auth/currentUser');
			const data = await res.json();
			setUser(data.user);
			setLoading(false);
		};

		init();
	}, []);


	const handleLogout = async () => {
		const toast6 = toast.loading('Déconnexion en cours...');
		try {
			const res = await fetch('/api/auth/logout', { method: 'GET' });
			if (res.ok) {
				toast.success('Déconnexion réussie', { id: toast6 });
				router.push('/auth/login');
			} else {
				toast.error('Échec de la déconnexion', { id: toast6 });
			}
		} catch (error) {
			toast.error('Une erreur est survenue', { id: toast6 });
		}
	};

	return (
		<div className="bg-white sticky top-0 z-40 border-b border-gray-200">
			<div className="w-full px-5">
				<div className="flex h-16 items-center">
					<div className="flex items-center justify-between w-full">
						<div className="shrink-0 flex items-center gap-4">
							<Image
								alt="Teamo logo"
								src="/images/timo.png"
								width={60}
								height={60}
								className="h-8 w-auto"
							/>
							<div className="flex items-center gap-3 pl-4 border-l border-gray-200">
								<div className="text-right flex items-center justify-center">
									<p className="text-sm font-medium text-gray-900">
										{loading ? (<Loader2 className="h-4 w-4 animate-spin" />) : user ? user.nom : 'Non connecté'}
									</p>
								</div>
								<div className="bg-teal-100 px-3 py-1 rounded-full flex items-center justify-center">
									<p className="text-sm text-black capitalize">Admin</p>
								</div>
							</div>
						</div>

						<div className="flex items-center gap-2">
							<button onClick={() => setOpenDra(true)}
								className="px-2 py-2 cursor-pointer relative border border-gray-200 rounded-full transition-all bg-white text-black hover:bg-gray-100">
								<Bell className="w-5 h-5" />
								{nonluCount > 0 && (
									<span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
										{nonluCount}
									</span>
								)}
							</button>

							{boutons.map((item) => {
								const Icon = item.icon;
								return (
									<button key={item.href} onClick={item.onClick}
										className={`px-2 py-2 cursor-pointer border border-gray-200 rounded-full transition-all ${isActive(item.href)
											? 'bg-orange-200 text-black'
											: 'bg-white text-black hover:bg-gray-100'
											}`}>
										<Icon className="w-5 h-5" />
									</button>
								);
							})}

							<div className="flex items-center pl-2 border-l border-gray-200">
								{/* Profile dropdown */}
								<Menu as="div" className="relative">
									<MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-hidden focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800">
										<span className="absolute -inset-1.5" />
										<span className="sr-only">OpenDra user menu</span>
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
												{loading ? (<Loader2 className="h-4 w-4 animate-spin" />) : user ? user.nom : 'Non connecté'}
											</span>
										</MenuItem>
										<MenuItem>
											<span></span>
										</MenuItem>
										<MenuItem>
											<a
												href="#"
												className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
											>
												Mon profil
											</a>
										</MenuItem>
										<MenuItem>
											<a
												href="#"
												className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
											>
												Paramètres
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
													? 'border-teal-600 text-teal-800 font-semibold'
													: 'border-none ',
												'border  transition-all w-full duration-150'
											)}>
										</span>
									</div>
								);
							})}
						</div>
					</div>
				</div>
			</div>
			<div className='z-50'>
				<Dialog open={openDra} onClose={setOpenDra} className="relative z-50">
					<DialogBackdrop
						transition
						className="fixed inset-0 bg-gray-500/75 transition-opacity duration-500 ease-in-out data-closed:opacity-0"
					/>

					<div className="fixed inset-0 overflow-hidden">
						<div className="absolute inset-0 overflow-hidden">
							<div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
								<DialogPanel
									transition
									className="pointer-events-auto relative w-screen max-w-md transform transition duration-500 ease-in-out data-closed:translate-x-full sm:duration-700"
								>
									<TransitionChild>
										<div className="absolute top-0 left-0 -ml-8 flex pt-4 pr-2 duration-500 ease-in-out data-closed:opacity-0 sm:-ml-10 sm:pr-4">
											<button
												type="button"
												onClick={() => setOpenDra(false)}
												className="relative rounded-md text-gray-300 hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-hidden cursor-pointer"
											>
												<span className="absolute -inset-2.5" />
												<span className="sr-only">Close panel</span>
												<XMarkIcon aria-hidden="true" className="size-6" />
											</button>
										</div>
									</TransitionChild>
									<div className="flex h-full flex-col overflow-y-auto bg-white py-6 shadow-xl">
										<div className="px-4 sm:px-6">
											<DialogTitle className="text-base font-semibold text-gray-900">
												<div className="flex items-center gap-3">
													<span className="text-2xl">Notifications</span>
												</div>
											</DialogTitle>
										</div>
										<div className="relative mt-6 flex-1 px-4 sm:px-6">
											{nonluCount > 0 ? (
												<div className="flex mb-2">
													<button
														onClick={markAllAsRead}
														className="text-md p-2 rounded-md cursor-pointer text-blue-600 w-full bg-blue-50 border border-blue-300 hover:bg-blue-100 hover:text-blue-700 transition-colors duration-500"
													>
														Tout marquer comme lu
													</button>
												</div>
											) : ""}

											<div className="grid grid-cols-1 space-y-2">
												{notifs.length === 0 ? (
													<p className="text-sm text-gray-500">Aucune notification</p>
												) : (
													notifs.map((notif) => (
														<div
															key={notif.id}
															onClick={() => markAsRead(notif.id)}
															className={`p-3 flex items-start space-x-3 rounded-md border cursor-pointer
															${notif.isRead ? 'bg-gray-100 border-gray-200' : 'bg-blue-50 border-blue-300'} 
															hover:bg-gray-200 transition-colors duration-500`}
														>
															<div className="mr-3 flex items-center justify-center h-full">
																<Bell size={16} />
															</div>
															<div>
																<p className="text-md text-gray-900">{notif.message}</p>
																<p className="text-sm text-gray-500 italic mt-1">
																	{new Date(notif.createdAt).toLocaleString()}
																</p>
															</div>
														</div>
													))
												)}
											</div>
										</div>

									</div>
								</DialogPanel>
							</div>
						</div>
					</div>
				</Dialog>
			</div>
		</div>
	)
}