import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import Link from 'next/link';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalSales: 0,
        pendingOrders: 0,
        averageOrderValue: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/stats')
            .then(r => r.json())
            .then(data => {
                setStats({
                    ...data,
                    averageOrderValue: data.totalOrders > 0 ? data.totalSales / data.totalOrders : 0
                });
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return (
        <AdminLayout>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-brand-gray-900 tracking-tight">Dashboard Overview</h1>
                    <p className="text-brand-gray-500 font-medium">Bienvenido de nuevo, Admin.</p>
                </div>
                <div className="flex gap-3">
                    <Link
                        href="/admin/products"
                        className="px-6 py-3 bg-brand-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg shadow-black/10 flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Gestionar Productos
                    </Link>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-white h-40 rounded-[24px] shadow-sm"></div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-in fade-in slide-in-from-bottom duration-500">
                    {/* Card 1: Sales */}
                    <div className="bg-white p-8 rounded-[32px] shadow-premium hover:transform hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                            <svg className="w-24 h-24 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-sm font-bold text-brand-gray-400 uppercase tracking-widest mb-1">Ventas Totales</h3>
                        <p className="text-4xl font-black text-brand-gray-900">
                            ${(stats.totalSales / 100).toFixed(2)}
                        </p>
                        <div className="mt-4 flex items-center gap-2 text-green-500 text-sm font-bold bg-green-50 w-fit px-3 py-1 rounded-full">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                            +12.5%
                        </div>
                    </div>

                    {/* Card 2: Orders */}
                    <div className="bg-white p-8 rounded-[32px] shadow-premium hover:transform hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                            <svg className="w-24 h-24 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <h3 className="text-sm font-bold text-brand-gray-400 uppercase tracking-widest mb-1">Pedidos Totales</h3>
                        <p className="text-4xl font-black text-brand-gray-900">{stats.totalOrders}</p>
                        <Link href="/admin/orders" className="text-sm font-bold text-blue-500 hover:text-blue-600 mt-4 inline-block">
                            Ver todos &rarr;
                        </Link>
                    </div>

                    {/* Card 3: Pending */}
                    <div className="bg-white p-8 rounded-[32px] shadow-premium hover:transform hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                            <svg className="w-24 h-24 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-sm font-bold text-brand-gray-400 uppercase tracking-widest mb-1">Pendientes Envío</h3>
                        <p className="text-4xl font-black text-orange-500">{stats.pendingOrders}</p>
                        <p className="text-xs font-medium text-brand-gray-400 mt-4">Requieren acción inmediata</p>
                    </div>

                    {/* Card 4: AOV */}
                    <div className="bg-white p-8 rounded-[32px] shadow-premium hover:transform hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                            <svg className="w-24 h-24 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <h3 className="text-sm font-bold text-brand-gray-400 uppercase tracking-widest mb-1">Ticket Promedio</h3>
                        <p className="text-4xl font-black text-brand-gray-900">
                            ${(stats.averageOrderValue / 100).toFixed(2)}
                        </p>
                        <p className="text-xs font-medium text-brand-gray-400 mt-4">Por orden completada</p>
                    </div>
                </div>
            )}

            {/* Recent Activity Section */}
            <div className="bg-white p-8 rounded-[32px] shadow-premium min-h-[400px]">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-bold text-brand-gray-900">Actividad Reciente</h2>
                    <select className="px-4 py-2 rounded-xl bg-brand-gray-50 border-none text-sm font-bold text-brand-gray-600 focus:ring-0">
                        <option>Últimos 7 días</option>
                        <option>Este mes</option>
                        <option>Hoy</option>
                    </select>
                </div>

                <div className="flex items-center justify-center h-64 text-brand-gray-300 bg-brand-gray-50 rounded-[24px] border-2 border-dashed border-brand-gray-100">
                    <div className="text-center">
                        <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                        </svg>
                        <p className="font-medium">El gráfico de actividad aparecerá aquí</p>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

