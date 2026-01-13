import React, { ReactNode, useState } from 'react';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useCart } from '../context/CartContext';
import CartDrawer from './CartDrawer';

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    const { data: session } = useSession();
    const { itemCount } = useCart();
    const [isCartOpen, setIsCartOpen] = useState(false);

    return (
        <div className="flex flex-col min-h-screen font-sans selection:bg-secondary/10 selection:text-secondary">
            <header className="sticky top-0 z-[50] bg-white/70 backdrop-blur-xl border-b border-brand-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="group flex items-center gap-2">
                        <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                            D
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-brand-gray-900">
                            DropStore<span className="text-secondary">.</span>
                        </span>
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center space-x-10">
                        <Link href="/" className="text-[15px] font-medium text-brand-gray-500 hover:text-primary transition-colors">Inicio</Link>
                        <Link href="/search" className="text-[15px] font-medium text-brand-gray-500 hover:text-primary transition-colors">Importar</Link>
                        <Link href="/#products" className="text-[15px] font-medium text-brand-gray-500 hover:text-primary transition-colors">Catálogo</Link>
                    </nav>

                    {/* User Actions */}
                    <div className="flex items-center space-x-6">
                        {session ? (
                            <div className="hidden sm:flex items-center gap-4">
                                <div className="h-8 w-8 bg-brand-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-brand-gray-600">
                                    {session.user?.name?.[0] || session.user?.email?.[0]}
                                </div>
                                <button
                                    onClick={() => signOut()}
                                    className="text-sm font-semibold text-brand-gray-400 hover:text-accent transition-colors"
                                >
                                    Salir
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => signIn()}
                                className="hidden sm:block text-sm font-semibold text-brand-gray-900 hover:text-secondary transition-colors"
                            >
                                Entrar
                            </button>
                        )}

                        <div
                            onClick={() => setIsCartOpen(true)}
                            className="relative h-11 w-11 flex items-center justify-center bg-brand-gray-100/50 hover:bg-brand-gray-100 rounded-2xl cursor-pointer transition-all active:scale-95 group"
                        >
                            <svg className="w-5 h-5 text-brand-gray-900 group-hover:text-secondary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            {itemCount > 0 && (
                                <span className="absolute -top-1 -right-1 h-5 w-5 bg-secondary rounded-lg text-[10px] font-bold text-white flex items-center justify-center border-2 border-white animate-in zoom-in duration-300">
                                    {itemCount}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

            <main className="flex-grow">
                {children}
            </main>

            <footer className="bg-brand-gray-900 text-white mt-12 py-16">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
                    <div className="space-y-4">
                        <div className="text-2xl font-bold tracking-tight">
                            DropStore<span className="text-secondary">.</span>
                        </div>
                        <p className="text-brand-gray-400 max-w-xs">
                            Tu socio confiable en dropshipping premium. Calidad y rapidez garantizada.
                        </p>
                    </div>
                    <div className="flex flex-col space-y-4">
                        <h4 className="font-bold">Links Rápidos</h4>
                        <Link href="/" className="text-brand-gray-400 hover:text-white transition-colors">Inicio</Link>
                        <Link href="/search" className="text-brand-gray-400 hover:text-white transition-colors">Importar</Link>
                    </div>
                    <div className="flex flex-col space-y-4 font-bold">
                        <p className="text-brand-gray-400 font-normal">Suscíbete a nuestro newsletter para ofertas exclusivas.</p>
                        <div className="flex gap-2">
                            <input type="text" placeholder="Email" className="bg-brand-gray-800 border-none rounded-xl px-4 py-2 flex-grow text-sm focus:ring-2 focus:ring-secondary transition-all" />
                            <button className="px-4 py-2 bg-secondary rounded-xl text-sm hover:bg-secondary/90 transition-colors">OK</button>
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-4 border-t border-brand-gray-800 mt-12 pt-8 text-center text-brand-gray-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} DropStore. Todos los derechos reservados.</p>
                </div>
            </footer>
        </div>
    );
}
