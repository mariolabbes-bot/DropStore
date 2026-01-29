import React, { useState } from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { items, loading, removeItem, total } = useCart();
  const [processing, setProcessing] = useState(false);

  async function checkout() {
    setProcessing(true);

    if (items.length === 0) {
      toast.error("El carrito está vacío");
      setProcessing(false);
      return;
    }

    // Redirect to checkout
    window.location.href = '/checkout';
  }

  // Remove Item Wrapper is already provided by context

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-brand-gray-50/30">
          <div className="text-2xl font-bold text-brand-gray-400">Cargando carrito...</div>
        </div>
      </Layout>
    );
  }

  if (items.length === 0) {
    return (
      <Layout>
        <div className="min-h-screen bg-brand-gray-50/30 py-16 flex flex-col items-center justify-center text-center px-4">
          <div className="w-24 h-24 bg-brand-gray-100 rounded-full flex items-center justify-center text-5xl mb-8">
            🛒
          </div>
          <h1 className="text-4xl font-black text-brand-gray-900 mb-4 tracking-tight">Tu carrito está vacío</h1>
          <p className="text-xl text-brand-gray-500 mb-10 max-w-md">
            Parece que no has añadido productos aún. Explora nuestro catálogo y encuentra algo único.
          </p>
          <Link href="/" className="px-10 py-5 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
            Explorar Tienda
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-brand-gray-50/30 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-black text-brand-gray-900 mb-12 tracking-tighter">
            Tu <span className="text-secondary italic">Carrito</span>
          </h1>

          <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-premium animate-in fade-in slide-in-from-bottom duration-700">
            <div className="space-y-8">
              {items.map((item: any) => (
                <div key={item.id} className="flex flex-col md:flex-row gap-6 items-center border-b border-brand-gray-100 pb-8 last:border-0 last:pb-0">
                  <Link href={`/products/${item.productId}`}>
                    <div className="w-24 h-24 bg-brand-gray-50 rounded-2xl overflow-hidden flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity">
                      {item.image ? (
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-brand-gray-300 font-bold">Sin Foto</div>
                      )}
                    </div>
                  </Link>

                  <div className="flex-1 text-center md:text-left">
                    <Link href={`/products/${item.productId}`}>
                      <h3 className="text-lg font-bold text-brand-gray-900 mb-1 hover:text-secondary cursor-pointer transition-colors max-w-md">{item.title}</h3>
                    </Link>
                    <p className="text-brand-gray-500 text-sm">Cantidad: {item.quantity}</p>
                  </div>

                  <div className="text-right">
                    <span className="block text-2xl font-black text-brand-gray-900">
                      ${((item.price * item.quantity) / 100).toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-xs font-bold text-red-500 mt-2 hover:text-red-600 transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 pt-8 border-t-2 border-brand-gray-50 flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <p className="text-brand-gray-400 font-medium text-sm">Subtotal (sin envío)</p>
                <p className="text-4xl font-black text-brand-gray-900 tracking-tight">
                  ${(total / 100).toFixed(2)}
                </p>
              </div>

              <div className="flex gap-4">
                <Link href="/" className="px-8 py-4 bg-brand-gray-100 text-brand-gray-900 font-bold rounded-2xl hover:bg-brand-gray-200 transition-colors">
                  Seguir Comprando
                </Link>
                <button
                  onClick={checkout}
                  disabled={processing}
                  className="px-10 py-4 bg-secondary text-white font-bold rounded-2xl shadow-lg shadow-secondary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                >
                  {processing ? 'Redirigiendo...' : 'Proceder al Pago'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
