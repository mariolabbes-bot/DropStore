
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import Head from 'next/head';
import VerifiedBadge from '../../components/ui/VerifiedBadge';
import TrustBar from '../../components/ui/TrustBar';

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Cart logic
  const addToCart = async () => {
    const cartId = localStorage.getItem('cartId');
    const loadingToast = toast.loading('Añadiendo al carrito...');
    const body = {
      cartId,
      productId: product.id,
      title: product.title,
      price: product.price,
      quantity: 1,
      image: product.image
    };

    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      localStorage.setItem('cartId', data.id || data.id);
      toast.success('¡Añadido al carrito!', { id: loadingToast });
      router.push('/cart');
    } catch (e) {
      console.error("Failed to add to cart", e);
      toast.error('Error al añadir', { id: loadingToast });
    }
  };

  if (!id) return;
  setLoading(true);
  // Use new single product API
  fetch(`/api/products/${id}`)
    .then(async (r) => {
      if (r.status === 404) {
        setProduct(null);
        return;
      }
      const data = await r.json();
      setProduct(data);
      if (data) setSelectedImage(data.image || (data.images && data.images[0]) || '');
    })
    .catch((e) => {
      console.error(e);
      toast.error('Error al cargar producto');
    })
    .finally(() => {
      setLoading(false);
    });
}, [id]);

if (loading) {
  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-brand-gray-50">
        <div className="animate-spin text-5xl">⏳</div>
      </div>
    </Layout>
  );
}

if (!product) {
  return (
    <Layout>
      <div className="min-h-screen flex flex-col items-center justify-center bg-brand-gray-50">
        <h1 className="text-3xl font-bold text-brand-gray-900 mb-4">Producto no encontrado</h1>
        <Link href="/search" className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90">
          Volver al Catálogo
        </Link>
      </div>
    </Layout>
  );
}

return (
  <Layout>
    <Head>
      <title>{product.title} | DropStore</title>
      <meta name="description" content={product.description?.substring(0, 160) || 'Compra este producto exclusivo en DropStore.'} />
      <meta property="og:title" content={product.title} />
      <meta property="og:description" content={product.description?.substring(0, 160)} />
      <meta property="og:image" content={selectedImage || product.image} />
      <meta property="og:type" content="product" />
      <meta property="og:price:amount" content={(product.price / 100).toFixed(2)} />
      <meta property="og:price:currency" content="USD" />
    </Head>

    {/* 
         Full screen container minus header height.
      */}
    <div className="bg-brand-gray-50 h-[calc(100vh-80px)] overflow-hidden flex flex-col">

      {/* Breadcrumb Compact */}
      <div className="bg-white border-b border-brand-gray-200 px-6 py-3 flex items-center text-xs font-medium text-brand-gray-400">
        <Link href="/" className="hover:text-brand-gray-900 transition-colors">Inicio</Link>
        <span className="mx-2">/</span>
        <Link href="/search" className="hover:text-brand-gray-900 transition-colors">Catálogo</Link>
        <span className="mx-2">/</span>
        <span className="text-brand-gray-900 truncate max-w-xs">{product.title}</span>
      </div>

      <div className="flex-grow flex flex-col lg:flex-row overflow-hidden">

        {/* LEFT COLUMN: IMAGES (65%) */}
        <div className="w-full lg:w-[65%] h-full flex flex-col bg-white overflow-y-auto p-6 scrollbar-hide">
          {/* Main Image Container */}
          <div className="flex-grow min-h-[400px] bg-brand-gray-50 rounded-[32px] overflow-hidden mb-6 border border-brand-gray-100 flex items-center justify-center relative group">
            {selectedImage ? (
              <img
                src={selectedImage}
                alt={product.title}
                className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <span className="text-brand-gray-300">Sin Imagen</span>
            )}
            {product.vendor && (
              <div className="absolute top-6 left-6 px-4 py-2 bg-black/50 backdrop-blur-md rounded-full text-white text-xs font-bold uppercase tracking-widest">
                {product.vendor}
              </div>
            )}
          </div>

          {/* Thumbnails Grid */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-3">
              {product.images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${selectedImage === img ? 'border-secondary shadow-lg ring-2 ring-secondary/20' : 'border-transparent bg-brand-gray-50 hover:border-brand-gray-200'}`}
                >
                  <img src={img} className="w-full h-full object-cover" alt={`View ${idx}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: INFO & ACTIONS (35%) */}
        <div className="w-full lg:w-[35%] h-full bg-brand-gray-50 border-l border-brand-gray-200 flex flex-col shadow-xl z-10">

          {/* Fixed Header Section stuck to top of right col */}
          <div className="p-8 bg-white border-b border-brand-gray-200 flex-shrink-0">

            {/* Verified Badge & Banner */}
            {product.verified && (
              <div className="mb-6 animate-in fade-in slide-in-from-left duration-700">
                <div className="flex items-center gap-4 mb-4">
                  <VerifiedBadge size="lg" showText={true} />
                  <div className="bg-yellow-50 px-4 py-2 rounded-xl border border-yellow-100 text-[10px] sm:text-xs text-yellow-800 font-medium">
                    ✨ Este producto ha sido <strong>comprado y validado</strong> por nosotros.
                  </div>
                </div>
              </div>
            )}

            <h1 className="text-2xl md:text-3xl font-black text-brand-gray-900 leading-tight mb-4 line-clamp-3">
              {product.title}
            </h1>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-black text-brand-gray-900 tracking-tight">
                  ${(product.price / 100).toFixed(2)}
                </span>
                <span className="text-lg text-brand-gray-400 line-through font-medium">
                  ${((product.price * 1.5) / 100).toFixed(2)}
                </span>
              </div>
              <div className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold uppercase tracking-wider">
                En Stock
              </div>
            </div>

            {/* MAIN CALL TO ACTION */}
            <button
              onClick={addToCart}
              className="w-full py-4 bg-brand-gray-900 text-white rounded-xl font-bold text-lg hover:bg-secondary hover:shadow-xl hover:shadow-secondary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3 mb-6"
            >
              <span>🛒</span> Añadir al Carrito
            </button>

            <TrustBar />
          </div>

          {/* Scrollable Description Area */}
          <div className="flex-grow overflow-y-auto p-8 prose prose-sm prose-slate max-w-none scrollbar-thin scrollbar-thumb-brand-gray-300">
            <h3 className="text-xs font-bold text-brand-gray-400 uppercase tracking-widest mb-4">Información del Producto</h3>
            <div
              className="product-description"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </div>
        </div>
      </div>
    </div>
  </Layout>
)
}
