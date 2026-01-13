import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

export default function SuccessPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { session_id } = router.query;
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session_id) {
      fetchOrderDetails();
    }
  }, [session_id]);

  const fetchOrderDetails = async () => {
    try {
      const res = await fetch(`/api/orders?sessionId=${session_id}`);
      if (res.ok) {
        const data = await res.json();
        setOrderDetails(data);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-2xl font-bold text-brand-gray-400">Cargando detalles de tu orden...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-brand-gray-50/30 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Success Animation */}
          <div className="text-center mb-12 animate-in zoom-in duration-500">
            <div className="inline-flex items-center justify-center w-32 h-32 bg-green-100 rounded-full mb-6">
              <svg className="w-16 h-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-5xl font-black text-brand-gray-900 mb-4 tracking-tighter">
              ¡Pago <span className="text-green-500 italic">Exitoso</span>!
            </h1>
            <p className="text-xl text-brand-gray-500 font-medium">
              Tu orden ha sido confirmada y está siendo procesada
            </p>
          </div>

          {/* Order Details Card */}
          <div className="bg-white rounded-[40px] p-10 shadow-premium mb-8">
            <div className="flex items-center justify-between mb-8 pb-8 border-b border-brand-gray-100">
              <div>
                <h2 className="text-2xl font-black text-brand-gray-900 mb-2">Orden Confirmada</h2>
                {orderDetails && (
                  <p className="text-brand-gray-500">
                    Número de orden: <span className="font-bold text-brand-gray-900">#{orderDetails.id}</span>
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm text-brand-gray-500 mb-1">Total Pagado</p>
                {orderDetails && (
                  <p className="text-3xl font-black text-green-500">
                    ${(orderDetails.total / 100).toFixed(2)}
                  </p>
                )}
              </div>
            </div>

            {/* Order Items */}
            {orderDetails?.items && orderDetails.items.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-black text-brand-gray-900 mb-6">Productos</h3>
                <div className="space-y-4">
                  {orderDetails.items.map((item: any) => (
                    <div key={item.id} className="flex gap-4 p-4 bg-brand-gray-50 rounded-2xl">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-20 h-20 object-cover rounded-xl"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-bold text-brand-gray-900">{item.title}</h4>
                        <p className="text-brand-gray-500 text-sm mt-1">
                          Cantidad: {item.quantity} × ${(item.price / 100).toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-brand-gray-900">
                          ${((item.price * item.quantity) / 100).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Shipping Info */}
            {orderDetails?.shippingAddress && (
              <div className="mb-8">
                <h3 className="text-lg font-black text-brand-gray-900 mb-4">Dirección de Envío</h3>
                <div className="p-6 bg-brand-gray-50 rounded-2xl">
                  <p className="text-brand-gray-700 whitespace-pre-line">
                    {orderDetails.shippingAddress}
                  </p>
                </div>
              </div>
            )}

            {/* Email Confirmation */}
            <div className="p-6 bg-blue-50 rounded-2xl border-2 border-blue-100">
              <div className="flex gap-4">
                <div className="text-blue-500 text-2xl">📧</div>
                <div>
                  <h3 className="font-bold text-brand-gray-900 mb-2">Confirmación Enviada</h3>
                  <p className="text-brand-gray-600 text-sm">
                    Hemos enviado un email de confirmación a{' '}
                    <span className="font-bold">{orderDetails?.customerEmail || session?.user?.email}</span>
                    {' '}con los detalles de tu orden y el número de seguimiento cuando esté disponible.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-white rounded-[40px] p-10 shadow-premium mb-8">
            <h3 className="text-2xl font-black text-brand-gray-900 mb-6">¿Qué sigue?</h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center text-secondary font-black">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-brand-gray-900 mb-1">Procesamiento de Orden</h4>
                  <p className="text-brand-gray-600 text-sm">
                    Estamos preparando tu pedido con nuestros proveedores. Esto puede tomar 1-2 días hábiles.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center text-secondary font-black">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-brand-gray-900 mb-1">Envío</h4>
                  <p className="text-brand-gray-600 text-sm">
                    Una vez confirmado, tu pedido será enviado. Recibirás un número de seguimiento por email.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center text-secondary font-black">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-brand-gray-900 mb-1">Entrega</h4>
                  <p className="text-brand-gray-600 text-sm">
                    El tiempo estimado de entrega es de 15-30 días hábiles dependiendo de tu ubicación.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {session && (
              <button
                onClick={() => router.push('/orders')}
                className="px-8 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-secondary transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-primary/20"
              >
                Ver Mis Órdenes
              </button>
            )}
            <button
              onClick={() => router.push('/products')}
              className="px-8 py-4 bg-white border-2 border-brand-gray-200 text-brand-gray-900 rounded-2xl font-bold hover:border-secondary hover:text-secondary transition-all hover:scale-[1.02] active:scale-95"
            >
              Seguir Comprando
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
