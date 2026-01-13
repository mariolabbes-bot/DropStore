import React, { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../components/Layout';

export default function Dashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (status === 'authenticated') {
            fetchOrders();
        }
    }, [status, router]);

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/orders');
            if (res.ok) {
                const data = await res.json();
                setOrders(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    if (status === 'loading') {
        return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
    }

    if (!session) return null;

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar / Profile Card */}
                    <div className="w-full md:w-1/4">
                        <div className="bg-white p-6 rounded-[32px] shadow-premium sticky top-24">
                            <div className="flex flex-col items-center text-center">
                                <div className="h-20 w-20 bg-brand-gray-100 rounded-full flex items-center justify-center text-2xl font-bold text-brand-gray-500 mb-4 border-4 border-brand-gray-50">
                                    {session.user?.name?.[0] || 'U'}
                                </div>
                                <h2 className="text-xl font-black text-brand-gray-900">{session.user?.name}</h2>
                                <p className="text-sm font-medium text-brand-gray-500 mb-6">{session.user?.email}</p>

                                {session.user?.role === 'admin' && (
                                    <Link href="/admin" className="w-full py-2 mb-3 bg-brand-gray-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-all shadow-lg flex items-center justify-center gap-2">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Panel Admin
                                    </Link>
                                )}

                                <button
                                    onClick={() => signOut({ callbackUrl: '/' })}
                                    className="w-full py-2 bg-red-50 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors"
                                >
                                    Cerrar Sesión
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="w-full md:w-3/4">
                        <h1 className="text-3xl font-black text-brand-gray-900 mb-8">Mis Pedidos</h1>

                        {loading ? (
                            <div className="space-y-4 animate-pulse">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-32 bg-white rounded-[24px]"></div>
                                ))}
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="bg-white p-12 rounded-[32px] shadow-premium text-center">
                                <div className="h-24 w-24 bg-brand-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-10 h-10 text-brand-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-brand-gray-900 mb-2">Aún no tienes pedidos</h3>
                                <p className="text-brand-gray-500 mb-8">¡Explora nuestro catálogo y encuentra algo increíble!</p>
                                <Link href="/" className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                                    Ir a comprar
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {orders.map((order) => (
                                    <div key={order.id} className="bg-white p-6 rounded-[24px] shadow-premium border border-transparent hover:border-brand-gray-200 transition-colors">
                                        <div className="flex flex-wrap items-center justify-between mb-4 pb-4 border-b border-brand-gray-50">
                                            <div>
                                                <p className="text-sm font-bold text-brand-gray-400 uppercase tracking-wide">Pedido #{order.id}</p>
                                                <p className="text-sm font-medium text-brand-gray-600">
                                                    {new Date(order.createdAt).toLocaleDateString(undefined, {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${order.status === 'paid' ? 'bg-green-100 text-green-700' :
                                                        order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                                                            'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                                <p className="text-xl font-black text-brand-gray-900">
                                                    ${(order.total / 100).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Items preview */}
                                        <div className="space-y-3">
                                            {order.items?.map((item: any) => (
                                                <div key={item.id} className="flex items-center gap-4">
                                                    <div className="h-12 w-12 bg-brand-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                        {item.image && (
                                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-bold text-brand-gray-900 truncate">{item.title}</p>
                                                        <p className="text-xs text-brand-gray-500">Cant: {item.quantity}</p>
                                                    </div>
                                                    <p className="text-sm font-bold text-brand-gray-900">
                                                        ${(item.price / 100).toFixed(2)}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
