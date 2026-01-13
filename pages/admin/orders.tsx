import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';

export default function AdminOrders() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            // Fetch from dedicated Admin API
            const res = await fetch('/api/admin/orders');
            if (res.ok) {
                const data = await res.json();
                setOrders(Array.isArray(data) ? data : []);
            } else {
                // Mock data if API fails or returns error (e.g. auth)
                setOrders([
                    { id: 101, customerName: 'John Doe', total: 4500, status: 'paid', createdAt: new Date().toISOString() },
                    { id: 102, customerName: 'Jane Smith', total: 1250, status: 'shipped', createdAt: new Date().toISOString() },
                ]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid': return 'bg-green-100 text-green-700';
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'shipped': return 'bg-blue-100 text-blue-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <AdminLayout>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black text-brand-gray-900 tracking-tight">Órdenes</h1>
                    <p className="text-brand-gray-500 font-medium">Gestiona y procesa los pedidos de clientes.</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-brand-gray-100 text-brand-gray-600 rounded-xl font-bold hover:bg-brand-gray-200 transition-colors">
                        Exportar CSV
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-[32px] shadow-premium overflow-hidden">
                <div className="p-6 border-b border-brand-gray-100 flex gap-4">
                    <input
                        type="text"
                        placeholder="Buscar por ID, cliente o email..."
                        className="flex-1 px-4 py-3 bg-brand-gray-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-secondary transition-all"
                    />
                    <select className="px-4 py-3 bg-brand-gray-50 border-none rounded-xl text-sm font-bold text-brand-gray-600 focus:ring-2 focus:ring-secondary">
                        <option>Todos los estados</option>
                        <option>Pagado</option>
                        <option>Enviado</option>
                        <option>Pendiente</option>
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-brand-gray-50/50">
                            <tr>
                                <th className="px-8 py-4 text-left text-xs font-bold text-brand-gray-400 uppercase tracking-widest">ID Orden</th>
                                <th className="px-8 py-4 text-left text-xs font-bold text-brand-gray-400 uppercase tracking-widest">Cliente</th>
                                <th className="px-8 py-4 text-left text-xs font-bold text-brand-gray-400 uppercase tracking-widest">Fecha</th>
                                <th className="px-8 py-4 text-left text-xs font-bold text-brand-gray-400 uppercase tracking-widest">Total</th>
                                <th className="px-8 py-4 text-left text-xs font-bold text-brand-gray-400 uppercase tracking-widest">Estado</th>
                                <th className="px-8 py-4 text-right text-xs font-bold text-brand-gray-400 uppercase tracking-widest">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-gray-50">
                            {loading ? (
                                <tr><td colSpan={6} className="px-8 py-12 text-center text-brand-gray-400">Cargando...</td></tr>
                            ) : orders.map((order) => (
                                <tr key={order.id} className="hover:bg-brand-gray-50/50 transition-colors cursor-pointer group">
                                    <td className="px-8 py-4 font-bold text-brand-gray-900">#{order.id}</td>
                                    <td className="px-8 py-4 text-brand-gray-600 font-medium">{order.customerName || 'Invitado'}</td>
                                    <td className="px-8 py-4 text-brand-gray-500 text-sm">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-8 py-4 font-bold text-brand-gray-900">${(order.total / 100).toFixed(2)}</td>
                                    <td className="px-8 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-4 text-right">
                                        <button className="text-brand-gray-400 hover:text-secondary font-bold text-sm transition-colors">
                                            Ver Detalles
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
