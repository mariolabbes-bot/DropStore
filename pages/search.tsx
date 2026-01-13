import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useSession, signIn } from 'next-auth/react';

export default function SearchPage() {
    const { data: session } = useSession();
    const [query, setQuery] = useState('');
    const [provider, setProvider] = useState('aliexpress');
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [importing, setImporting] = useState<string | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setResults([]);

        try {
            const res = await fetch(`/api/products/import?query=${encodeURIComponent(query)}&provider=${provider}`);
            if (res.ok) {
                const data = await res.json();
                setResults(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleImport = async (product: any) => {
        setImporting(product.externalId);

        try {
            const res = await fetch('/api/products/import', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ externalId: product.externalId, provider })
            });

            if (res.ok) {
                // Feedback could be a toast
            }
        } catch (error) {
            console.error(error);
        } finally {
            setImporting(null);
        }
    };

    if (!session) {
        return (
            <Layout>
                <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 bg-brand-gray-50/30">
                    <div className="max-w-md w-full glass-card p-12 rounded-[40px] text-center space-y-8 animate-in zoom-in duration-500">
                        <div className="h-24 w-24 bg-accent/10 rounded-full flex items-center justify-center text-5xl mx-auto">
                            🔒
                        </div>
                        <div className="space-y-4">
                            <h1 className="text-3xl font-black text-brand-gray-900 tracking-tight">Zona Restringida</h1>
                            <p className="text-brand-gray-500 leading-relaxed font-medium">Solo los administradores pueden importar nuevos tesoros a la tienda.</p>
                        </div>
                        <button
                            onClick={() => signIn()}
                            className="w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-primary/10 hover:shadow-primary/20 hover:scale-[1.02] transition-all active:scale-95"
                        >
                            Entrar como Admin
                        </button>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen bg-brand-gray-50/30 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
                        <div className="space-y-2">
                            <h1 className="text-5xl font-black text-brand-gray-900 tracking-tighter">Explorador de <span className="text-secondary italic">Proveedores</span></h1>
                            <p className="text-brand-gray-500 text-lg font-medium">Importa productos directamente a tu inventario.</p>
                        </div>

                        <div className="inline-flex p-1.5 bg-white border border-brand-gray-100 rounded-2xl shadow-sm">
                            {['aliexpress', 'rapidapi', 'cj'].map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setProvider(p)}
                                    className={`px-6 py-2.5 rounded-[14px] text-sm font-bold uppercase tracking-wider transition-all ${provider === p ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-brand-gray-400 hover:text-brand-gray-900'}`}
                                >
                                    {p === 'cj' ? 'CJDropshipping' : p}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="mb-20 max-w-4xl">
                        <div className="relative group">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Busca en el mundo..."
                                className="w-full pl-16 pr-40 py-6 bg-white rounded-[32px] border-none shadow-premium focus:ring-4 focus:ring-secondary/20 transition-all text-xl font-medium placeholder:text-brand-gray-300 outline-none"
                            />
                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-gray-400 group-focus-within:text-secondary transition-colors">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="absolute right-3 top-1/2 -translate-y-1/2 px-10 py-4 bg-secondary text-white font-bold rounded-2xl hover:bg-secondary/90 disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-secondary/20"
                            >
                                {loading ? 'Explorando...' : 'Buscar'}
                            </button>
                        </div>
                    </form>

                    {/* Results Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-96 rounded-[40px] bg-white animate-pulse shadow-sm" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 animate-in fade-in slide-in-from-bottom duration-700">
                            {results.map((product) => (
                                <div key={product.externalId} className="group relative flex flex-col h-full bg-white rounded-[40px] overflow-hidden border border-brand-gray-100/50 hover:border-secondary/20 transition-all duration-500 hover:shadow-premium">
                                    <div className="aspect-[4/3] bg-brand-gray-50 relative overflow-hidden">
                                        <img
                                            src={product.images[0]}
                                            alt={product.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute top-4 left-4 inline-flex px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest">
                                            {product.vendor}
                                        </div>
                                    </div>
                                    <div className="p-8 flex flex-col flex-grow">
                                        <h3 className="font-bold text-xl text-brand-gray-900 mb-3 line-clamp-1">{product.title}</h3>
                                        <p className="text-brand-gray-400 text-sm mb-8 line-clamp-2 leading-relaxed font-medium">{product.description || 'Sin descripción disponible.'}</p>

                                        <div className="mt-auto flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-brand-gray-300 uppercase tracking-widest">Precio Estimado</span>
                                                <span className="text-2xl font-black text-brand-gray-900">
                                                    ${(product.price / 100).toFixed(2)}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => handleImport(product)}
                                                disabled={importing === product.externalId}
                                                className={`px-6 py-4 rounded-2xl text-sm font-bold transition-all active:scale-95 ${importing === product.externalId ? 'bg-brand-gray-100 text-brand-gray-400' : 'bg-primary text-white hover:bg-secondary hover:shadow-xl hover:shadow-secondary/20'}`}
                                            >
                                                {importing === product.externalId ? 'Importando...' : 'Importar Item'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {!loading && results.length === 0 && query && (
                        <div className="text-center py-32 space-y-6">
                            <div className="text-6xl">🔍</div>
                            <p className="text-2xl font-bold text-brand-gray-400">No encontramos nada para "{query}"</p>
                            <p className="text-brand-gray-300">Intenta con otros términos o cambia de proveedor.</p>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
