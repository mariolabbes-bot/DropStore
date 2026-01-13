import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function AdminProducts() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            // Placeholder: Replace with real API call
            // const res = await fetch('/api/admin/products');
            // const data = await res.json();
            // setProducts(data);

            // Mock data for now until API is ready
            setProducts([
                { id: 1, title: 'Mock Product 1', price: 1999, stock: 10, active: true, vendor: 'AliExpress' },
                { id: 2, title: 'Mock Product 2', price: 2499, stock: 0, active: false, vendor: 'CJDropshipping' },
            ]);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black text-brand-gray-900 tracking-tight">Productos</h1>
                    <p className="text-brand-gray-500 font-medium">Gestiona tu inventario y precios.</p>
                </div>
                <Link
                    href="/search"
                    className="px-6 py-3 bg-secondary text-white rounded-xl font-bold hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/20 flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Nuevo
                </Link>
            </div>

            <div className="bg-white rounded-[32px] shadow-premium overflow-hidden">
                <div className="p-6 border-b border-brand-gray-100 flex gap-4">
                    <input
                        type="text"
                        placeholder="Buscar producto..."
                        className="flex-1 px-4 py-3 bg-brand-gray-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-secondary transition-all"
                    />
                    <select className="px-4 py-3 bg-brand-gray-50 border-none rounded-xl text-sm font-bold text-brand-gray-600 focus:ring-2 focus:ring-secondary">
                        <option>Todos los estados</option>
                        <option>Activo</option>
                        <option>Inactivo</option>
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-brand-gray-50/50">
                            <tr>
                                <th className="px-8 py-4 text-left text-xs font-bold text-brand-gray-400 uppercase tracking-widest">Producto</th>
                                <th className="px-8 py-4 text-left text-xs font-bold text-brand-gray-400 uppercase tracking-widest">Precio</th>
                                <th className="px-8 py-4 text-left text-xs font-bold text-brand-gray-400 uppercase tracking-widest">Stock</th>
                                <th className="px-8 py-4 text-left text-xs font-bold text-brand-gray-400 uppercase tracking-widest">Vendor</th>
                                <th className="px-8 py-4 text-left text-xs font-bold text-brand-gray-400 uppercase tracking-widest">Estado</th>
                                <th className="px-8 py-4 text-right text-xs font-bold text-brand-gray-400 uppercase tracking-widest">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-gray-50">
                            {loading ? (
                                <tr><td colSpan={6} className="px-8 py-12 text-center text-brand-gray-400">Cargando...</td></tr>
                            ) : products.map((product) => (
                                <tr key={product.id} className="hover:bg-brand-gray-50/50 transition-colors group">
                                    <td className="px-8 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 bg-brand-gray-100 rounded-xl"></div>
                                            <span className="font-bold text-brand-gray-900">{product.title}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-4 font-medium text-brand-gray-600">${(product.price / 100).toFixed(2)}</td>
                                    <td className="px-8 py-4 font-medium text-brand-gray-600">{product.stock}</td>
                                    <td className="px-8 py-4">
                                        <span className="px-3 py-1 bg-brand-gray-100 text-brand-gray-600 rounded-full text-xs font-bold">
                                            {product.vendor}
                                        </span>
                                    </td>
                                    <td className="px-8 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit ${product.active ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${product.active ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                            {product.active ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-4 text-right">
                                        <button className="text-brand-gray-400 hover:text-secondary font-bold text-sm transition-colors">
                                            Editar
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
