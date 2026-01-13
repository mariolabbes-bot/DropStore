import React, { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import Layout from './Layout';

interface AdminLayoutProps {
    children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const router = useRouter();
    const { data: session } = useSession();

    const menuItems = [
        { label: 'Overview', href: '/admin', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
        { label: 'Productos', href: '/admin/products', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
        { label: 'Órdenes', href: '/admin/orders', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
    ];

    if (!session || session.user?.role !== 'admin') {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-brand-gray-900 mb-2">Acceso Restringido</h1>
                        <p className="text-brand-gray-500 mb-6">Necesitas permisos de administrador para ver esta página.</p>
                        <Link href="/" className="px-6 py-3 bg-primary text-white rounded-xl font-bold">Volver al Inicio</Link>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <div className="min-h-screen bg-brand-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-brand-gray-100 flex flex-col fixed h-full z-20">
                <div className="h-20 flex items-center px-8 border-b border-brand-gray-100">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="h-8 w-8 bg-brand-gray-900 rounded-lg flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-105 transition-transform">
                            A
                        </div>
                        <span className="text-xl font-black tracking-tight text-brand-gray-900">
                            Admin<span className="text-secondary">.</span>
                        </span>
                    </Link>
                </div>

                <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
                    {menuItems.map((item) => {
                        const isActive = router.pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${isActive
                                        ? 'bg-brand-gray-900 text-white shadow-lg shadow-brand-gray-900/20'
                                        : 'text-brand-gray-500 hover:bg-brand-gray-50 hover:text-brand-gray-900'
                                    }`}
                            >
                                <svg className={`w-5 h-5 ${isActive ? 'text-secondary' : 'text-brand-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                                </svg>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-brand-gray-100">
                    <div className="bg-brand-gray-50 rounded-2xl p-4 flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-brand-gray-900 font-bold border border-brand-gray-200">
                            {session.user?.name?.[0] || 'A'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-brand-gray-900 truncate">{session.user?.name}</p>
                            <p className="text-xs text-brand-gray-500 truncate">{session.user?.role}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => signOut()}
                        className="w-full py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
