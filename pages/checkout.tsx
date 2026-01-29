import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useCart } from '../context/CartContext';

interface CartItem {
    id: number;
    productId: number;
    title: string;
    price: number;
    quantity: number;
    image?: string;
}

export default function CheckoutPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const { items: cartItems, loading } = useCart();
    const [processing, setProcessing] = useState(false);

    // Shipping form state
    const [shippingInfo, setShippingInfo] = useState({
        name: session?.user?.name || '',
        email: session?.user?.email || '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        phone: ''
    });

    const calculateTotal = () => {
        return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setShippingInfo({
            ...shippingInfo,
            [e.target.name]: e.target.value
        });
    };

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form
        const requiredFields = ['name', 'email', 'address', 'city', 'zipCode', 'country'];
        const missingFields = requiredFields.filter(field => !shippingInfo[field as keyof typeof shippingInfo]);

        if (missingFields.length > 0) {
            alert('Por favor completa todos los campos requeridos');
            return;
        }

        setProcessing(true);

        try {
            const res = await fetch('/api/stripe/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: cartItems,
                    shippingInfo,
                    userId: session?.user?.id
                })
            });

            if (res.ok) {
                const { url } = await res.json();
                window.location.href = url;
            } else {
                const error = await res.json();
                alert(error.error || 'Error al crear sesión de pago');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Error al procesar el pago');
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-2xl font-bold text-brand-gray-400">Cargando...</div>
                </div>
            </Layout>
        );
    }

    if (cartItems.length === 0) {
        return (
            <Layout>
                <div className="min-h-screen flex flex-col items-center justify-center p-8">
                    <div className="text-6xl mb-6">🛒</div>
                    <h1 className="text-3xl font-black text-brand-gray-900 mb-4">Tu carrito está vacío</h1>
                    <p className="text-brand-gray-500 mb-8">Agrega productos antes de proceder al checkout</p>
                    <button
                        onClick={() => router.push('/products')}
                        className="px-8 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-secondary transition-all"
                    >
                        Explorar Productos
                    </button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen bg-brand-gray-50/30 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-5xl font-black text-brand-gray-900 mb-12 tracking-tighter">
                        Finalizar <span className="text-secondary italic">Compra</span>
                    </h1>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Shipping Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-[40px] p-10 shadow-premium">
                                <h2 className="text-2xl font-black text-brand-gray-900 mb-8">Información de Envío</h2>

                                <form onSubmit={handleCheckout} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-brand-gray-700 mb-2">
                                                Nombre Completo *
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={shippingInfo.name}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-6 py-4 rounded-2xl border border-brand-gray-200 focus:ring-4 focus:ring-secondary/20 outline-none transition-all"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-brand-gray-700 mb-2">
                                                Email *
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={shippingInfo.email}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-6 py-4 rounded-2xl border border-brand-gray-200 focus:ring-4 focus:ring-secondary/20 outline-none transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-brand-gray-700 mb-2">
                                            Dirección *
                                        </label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={shippingInfo.address}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-6 py-4 rounded-2xl border border-brand-gray-200 focus:ring-4 focus:ring-secondary/20 outline-none transition-all"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-brand-gray-700 mb-2">
                                                Ciudad *
                                            </label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={shippingInfo.city}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-6 py-4 rounded-2xl border border-brand-gray-200 focus:ring-4 focus:ring-secondary/20 outline-none transition-all"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-brand-gray-700 mb-2">
                                                Estado/Provincia
                                            </label>
                                            <input
                                                type="text"
                                                name="state"
                                                value={shippingInfo.state}
                                                onChange={handleInputChange}
                                                className="w-full px-6 py-4 rounded-2xl border border-brand-gray-200 focus:ring-4 focus:ring-secondary/20 outline-none transition-all"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-brand-gray-700 mb-2">
                                                Código Postal *
                                            </label>
                                            <input
                                                type="text"
                                                name="zipCode"
                                                value={shippingInfo.zipCode}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-6 py-4 rounded-2xl border border-brand-gray-200 focus:ring-4 focus:ring-secondary/20 outline-none transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-brand-gray-700 mb-2">
                                                País *
                                            </label>
                                            <input
                                                type="text"
                                                name="country"
                                                value={shippingInfo.country}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-6 py-4 rounded-2xl border border-brand-gray-200 focus:ring-4 focus:ring-secondary/20 outline-none transition-all"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-brand-gray-700 mb-2">
                                                Teléfono
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={shippingInfo.phone}
                                                onChange={handleInputChange}
                                                className="w-full px-6 py-4 rounded-2xl border border-brand-gray-200 focus:ring-4 focus:ring-secondary/20 outline-none transition-all"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full py-5 bg-secondary text-white rounded-2xl font-bold text-lg hover:bg-secondary/90 disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-secondary/20 mt-8"
                                    >
                                        {processing ? 'Procesando...' : 'Proceder al Pago'}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-[40px] p-10 shadow-premium sticky top-8">
                                <h2 className="text-2xl font-black text-brand-gray-900 mb-8">Resumen de Orden</h2>

                                <div className="space-y-6 mb-8">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex gap-4">
                                            {item.image && (
                                                <img
                                                    src={item.image}
                                                    alt={item.title}
                                                    className="w-20 h-20 object-cover rounded-2xl"
                                                />
                                            )}
                                            <div className="flex-1">
                                                <h3 className="font-bold text-brand-gray-900 text-sm line-clamp-2">
                                                    {item.title}
                                                </h3>
                                                <p className="text-brand-gray-500 text-sm mt-1">
                                                    Cantidad: {item.quantity}
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

                                <div className="border-t border-brand-gray-100 pt-6 space-y-4">
                                    <div className="flex justify-between text-brand-gray-600">
                                        <span>Subtotal</span>
                                        <span className="font-bold">${(calculateTotal() / 100).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-brand-gray-600">
                                        <span>Envío</span>
                                        <span className="font-bold">Calculado en checkout</span>
                                    </div>
                                    <div className="border-t border-brand-gray-100 pt-4 flex justify-between text-2xl font-black text-brand-gray-900">
                                        <span>Total</span>
                                        <span>${(calculateTotal() / 100).toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="mt-8 p-4 bg-brand-gray-50 rounded-2xl">
                                    <p className="text-xs text-brand-gray-500 text-center">
                                        🔒 Pago seguro procesado por Stripe
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
