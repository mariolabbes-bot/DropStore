import React from 'react';
import { useCart } from '../context/CartContext';
import Link from 'next/link';

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
    const { items, removeItem, total } = useCart();

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Drawer */}
            <div className={`fixed right-0 top-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl transition-transform duration-500 ease-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col h-full bg-[#fdfdfd]">
                    <div className="p-6 border-b border-brand-gray-100 flex items-center justify-between">
                        <h2 className="text-2xl font-bold font-sans">Tu Carrito</h2>
                        <button onClick={onClose} className="p-2 hover:bg-brand-gray-100 rounded-full transition-colors text-2xl">&times;</button>
                    </div>

                    <div className="flex-grow overflow-y-auto p-6 space-y-6">
                        {items.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                                <span className="text-6xl text-gray-200">🛒</span>
                                <p className="text-brand-gray-500">Tu carrito está vacío</p>
                                <button
                                    onClick={onClose}
                                    className="px-6 py-2 bg-secondary text-white rounded-full font-medium hover:bg-secondary/90 transition-colors"
                                >
                                    Continuar Comprando
                                </button>
                            </div>
                        ) : (
                            items.map((item) => (
                                <div key={item.id} className="flex gap-4 group">
                                    <Link href={`/products/${item.productId}`}>
                                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-brand-gray-100 border border-brand-gray-100 group-hover:border-secondary/20 transition-colors cursor-pointer">
                                            {item.image && <img src={item.image} alt={item.title} className="h-full w-full object-cover" />}
                                        </div>
                                    </Link>
                                    <div className="flex flex-col justify-between py-1 flex-grow">
                                        <div>
                                            <h4 className="font-semibold text-brand-gray-900 line-clamp-1">{item.title}</h4>
                                            <p className="text-brand-gray-500 text-sm">Cantidad: {item.quantity}</p>
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <span className="font-bold text-lg text-secondary">${(item.price / 100).toFixed(2)}</span>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-accent hover:underline text-sm font-medium"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {items.length > 0 && (
                        <div className="p-6 bg-white border-t border-brand-gray-100 space-y-4 shadow-[0_-4px_20px_0_rgba(0,0,0,0.03)]">
                            <div className="flex justify-between text-xl font-bold">
                                <span>Total</span>
                                <span className="text-secondary">${(total / 100).toFixed(2)}</span>
                            </div>
                            <p className="text-sm text-brand-gray-500">Impuestos y envío calculados al finalizar la compra.</p>
                            <button
                                className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-primary/95 transition-all active:scale-[0.98] shadow-lg shadow-primary/10"
                                onClick={() => window.location.href = '/checkout'}
                            >
                                Pagar Ahora
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
