
import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { toast } from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import Head from 'next/head';

export default function AdminProducts() {
    const { data: session } = useSession();
    const [selectedProvider, setSelectedProvider] = useState('cj');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [importedProducts, setImportedProducts] = useState<any[]>([]);
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [loadingImported, setLoadingImported] = useState(true);
    const [importingId, setImportingId] = useState<string | null>(null);
    const [providerStatuses, setProviderStatuses] = useState<any[]>([]);

    // Direct Import States
    const [directInput, setDirectInput] = useState('');
    const [previewProduct, setPreviewProduct] = useState<any>(null);
    const [loadingPreview, setLoadingPreview] = useState(false);

    // Fetch imported products and statuses on mount
    useEffect(() => {
        fetchImported();
        fetchProviderStatuses();
    }, []);

    const fetchProviderStatuses = async () => {
        try {
            const res = await fetch('/api/admin/providers/status');
            const data = await res.json();
            setProviderStatuses(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching provider statuses');
        }
    };

    const fetchImported = async () => {
        setLoadingImported(true);
        try {
            const res = await fetch('/api/admin/products');
            const data = await res.json();
            setImportedProducts(Array.isArray(data) ? data : []);
        } catch (error) {
            toast.error('Error cargando productos importados');
        } finally {
            setLoadingImported(false);
        }
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setLoadingSearch(true);
        setSearchResults([]);
        try {
            const res = await fetch(`/api/admin/products/search?q=${encodeURIComponent(searchQuery)}&provider=${selectedProvider}`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setSearchResults(data);
            } else {
                toast.error(data.message || 'Error en la búsqueda');
            }
        } catch (error) {
            toast.error('Error conectando con el proveedor');
        } finally {
            setLoadingSearch(false);
        }
    };

    const handleImport = async (externalProduct: any) => {
        setImportingId(externalProduct.externalId);
        const loadingToast = toast.loading(`Importando ${externalProduct.title}...`);

        try {
            const res = await fetch('/api/admin/products/import', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    externalId: externalProduct.externalId,
                    provider: selectedProvider
                })
            });
            const data = await res.json();

            if (res.ok) {
                toast.success('¡Producto importado con éxito!', { id: loadingToast });
                fetchImported(); // Refresh list
            } else {
                toast.error(data.message || 'Error al importar', { id: loadingToast });
            }
        } catch (error) {
            toast.error('Error de conexión', { id: loadingToast });
        } finally {
            setImportingId(null);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Estás seguro de eliminar este producto?')) return;

        const loadingToast = toast.loading('Eliminando...');
        try {
            const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success('Producto eliminado', { id: loadingToast });
                fetchImported();
            } else {
                toast.error('Error al eliminar', { id: loadingToast });
            }
        } catch (error) {
            toast.error('Error de conexión', { id: loadingToast });
        }
    };

    const extractAliexpressId = (input: string) => {
        // Match digits only or extract from URL
        const idMatch = input.match(/(\d{10,20})/);
        return idMatch ? idMatch[1] : null;
    };

    const handlePreview = async () => {
        const id = extractAliexpressId(directInput);
        if (!id) {
            toast.error('Enlace o ID no válido para AliExpress');
            return;
        }

        setLoadingPreview(true);
        setPreviewProduct(null);
        try {
            const res = await fetch(`/api/admin/products/details?id=${id}&provider=aliexpress`);
            const data = await res.json();
            if (res.ok) {
                setPreviewProduct(data);
            } else {
                toast.error(data.message || 'Error al obtener detalles');
            }
        } catch (error) {
            toast.error('Error de conexión');
        } finally {
            setLoadingPreview(false);
        }
    };

    if (session?.user?.email !== 'admin@dropstore.com') {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <p className="text-xl font-bold text-brand-gray-500 underline decoration-secondary">Acceso restringido</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <Head>
                <title>Admin Products | DropStore</title>
            </Head>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-12 flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-black text-brand-gray-900 mb-2">Administración de Productos</h1>
                        <p className="text-brand-gray-500">Busca e importa productos de proveedores externos.</p>
                    </div>
                    <div className="flex gap-4">
                        {providerStatuses.map(status => (
                            <div key={status.id} className="flex flex-col items-end">
                                <span className="text-[10px] font-bold text-brand-gray-400 uppercase tracking-widest">{status.name}</span>
                                <div className="flex items-center gap-2">
                                    <div className={`h-2 w-2 rounded-full ${status.connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                                    <span className={`text-xs font-bold ${status.connected ? 'text-green-600' : 'text-red-600'}`}>
                                        {status.connected ? 'Conectado' : 'Desconectado'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left: Search & Import */}
                    <div className="space-y-8">
                        <section className="bg-white rounded-[32px] p-8 border border-brand-gray-100 shadow-sm">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <span className="text-2xl">🔍</span> Buscar en Proveedores
                            </h2>

                            {/* Provider Selection Tabs */}
                            <div className="flex gap-4 mb-8 p-1 bg-brand-gray-50 rounded-2xl w-fit">
                                <button
                                    onClick={() => {
                                        setSelectedProvider('cj');
                                        setSearchResults([]);
                                    }}
                                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${selectedProvider === 'cj'
                                        ? 'bg-white text-primary shadow-sm'
                                        : 'text-brand-gray-400 hover:text-brand-gray-600'
                                        }`}
                                >
                                    CJ Dropshipping
                                </button>
                                <button
                                    onClick={() => {
                                        setSelectedProvider('aliexpress');
                                        setSearchResults([]);
                                    }}
                                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${selectedProvider === 'aliexpress'
                                        ? 'bg-white text-[#FF4747] shadow-sm'
                                        : 'text-brand-gray-400 hover:text-brand-gray-600'
                                        }`}
                                >
                                    AliExpress
                                </button>
                            </div>

                            <form onSubmit={handleSearch} className="flex gap-2">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={selectedProvider === 'cj' ? "Nombre o SKU de CJ..." : "Nombre del producto de AliExpress..."}
                                    className="flex-grow bg-brand-gray-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-primary transition-all"
                                />
                                <button
                                    type="submit"
                                    disabled={loadingSearch}
                                    className={`px-8 py-4 text-white rounded-2xl font-bold transition-all disabled:opacity-50 ${selectedProvider === 'cj' ? 'bg-primary hover:bg-primary/90' : 'bg-[#FF4747] hover:bg-[#FF4747]/90'
                                        }`}
                                >
                                    {loadingSearch ? 'Buscando...' : 'Buscar'}
                                </button>
                            </form>

                            {/* Direct Import (AliExpress Only) */}
                            {selectedProvider === 'aliexpress' && (
                                <div className="mt-8 pt-8 border-t border-brand-gray-100">
                                    <h3 className="text-sm font-bold text-brand-gray-400 uppercase tracking-widest mb-4">Importación Directa por URL</h3>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={directInput}
                                            onChange={(e) => setDirectInput(e.target.value)}
                                            placeholder="Pega el enlace o ID de AliExpress..."
                                            className="flex-grow bg-brand-gray-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[#FF4747] transition-all"
                                        />
                                        <button
                                            onClick={handlePreview}
                                            disabled={loadingPreview || !directInput}
                                            className="px-8 py-4 bg-brand-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all disabled:opacity-50"
                                        >
                                            {loadingPreview ? '...' : 'Previsualizar'}
                                        </button>
                                    </div>

                                    {/* Preview Card */}
                                    {previewProduct && (
                                        <div className="mt-4 p-4 bg-[#FFF5F5] rounded-3xl border border-[#FFDADA] flex gap-4 items-center animate-in zoom-in duration-300">
                                            <div className="h-20 w-20 rounded-2xl overflow-hidden bg-white flex-shrink-0">
                                                <img src={previewProduct.images[0]} alt={previewProduct.title} className="h-full w-full object-cover" />
                                            </div>
                                            <div className="flex-grow min-w-0">
                                                <h4 className="font-bold text-sm text-brand-gray-900 line-clamp-1">{previewProduct.title}</h4>
                                                <p className="font-black text-[#FF4747] mt-1">${(previewProduct.price / 100).toFixed(2)}</p>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    handleImport(previewProduct);
                                                    setPreviewProduct(null);
                                                    setDirectInput('');
                                                }}
                                                disabled={importingId === previewProduct.externalId}
                                                className="px-6 py-3 bg-[#FF4747] text-white rounded-xl text-xs font-bold hover:bg-[#E63E3E] transition-all"
                                            >
                                                Confirmar Importación
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </section>

                        <div className="space-y-4">
                            {searchResults.length > 0 && (
                                <h3 className="text-sm font-bold text-brand-gray-400 uppercase tracking-widest pl-4">Resultados de Búsqueda</h3>
                            )}
                            <div className="grid grid-cols-1 gap-4">
                                {searchResults.map((item) => (
                                    <div key={item.externalId} className="bg-white rounded-3xl p-4 border border-brand-gray-100 flex gap-4 items-center animate-in fade-in slide-in-from-bottom duration-500">
                                        <div className="h-20 w-20 rounded-2xl overflow-hidden bg-brand-gray-50 flex-shrink-0">
                                            <img src={item.images[0]} alt={item.title} className="h-full w-full object-cover" />
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <h4 className="font-bold text-sm text-brand-gray-900 line-clamp-1">{item.title}</h4>
                                            <p className="text-xs text-brand-gray-400 mt-1">Ref: {item.externalId}</p>
                                            <p className="font-black text-primary mt-1">${(item.price / 100).toFixed(2)}</p>
                                        </div>
                                        <button
                                            onClick={() => handleImport(item)}
                                            disabled={importingId === item.externalId}
                                            className="px-6 py-3 bg-secondary text-white rounded-xl text-xs font-bold hover:bg-secondary/90 transition-all disabled:opacity-50"
                                        >
                                            {importingId === item.externalId ? '...' : 'Importar'}
                                        </button>
                                    </div>
                                ))}
                                {loadingSearch && (
                                    [1, 2, 3].map(i => (
                                        <div key={i} className="h-28 bg-white rounded-3xl animate-pulse border border-brand-gray-100" />
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: Inventory Management */}
                    <div className="space-y-8">
                        <section className="bg-brand-gray-900 rounded-[32px] p-8 text-white">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <span className="text-2xl">📦</span> Inventario Actual ({importedProducts.length})
                            </h2>

                            <div className="space-y-4 max-h-[1000px] overflow-y-auto pr-2 custom-scrollbar">
                                {importedProducts.map((product) => (
                                    <div key={product.id} className="bg-white/5 rounded-2xl p-4 border border-white/10 flex gap-4 items-center">
                                        <div className="h-16 w-16 rounded-xl overflow-hidden bg-white/10 flex-shrink-0">
                                            <img src={product.image} alt={product.title} className="h-full w-full object-cover" />
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <h4 className="font-bold text-sm text-white line-clamp-1">{product.title}</h4>
                                            <div className="flex gap-4 mt-1">
                                                <p className="text-[10px] text-brand-gray-400">COSTO: ${(product.costPrice / 100).toFixed(2)}</p>
                                                <p className="text-[10px] text-secondary font-bold">VENTA: ${(product.price / 100).toFixed(2)}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                                                title="Eliminar"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {loadingImported && (
                                    <p className="text-center text-brand-gray-500 py-8">Cargando inventario...</p>
                                )}
                                {!loadingImported && importedProducts.length === 0 && (
                                    <p className="text-center text-brand-gray-500 py-8">No hay productos importados aún.</p>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
            `}</style>
        </Layout>
    );
}
