
import React from 'react';

export default function TrustBar() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-8 border-t border-brand-gray-100 mt-8">
            {/* Item 1: Secure Payment */}
            <div className="flex items-center gap-3 justify-center md:justify-start">
                <div className="p-2 bg-brand-gray-50 rounded-lg text-brand-gray-900">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
                <div>
                    <h4 className="text-sm font-bold text-brand-gray-900">Pago 100% Seguro</h4>
                    <p className="text-xs text-brand-gray-500">Procesado por Stripe</p>
                </div>
            </div>

            {/* Item 2: Global Shipping */}
            <div className="flex items-center gap-3 justify-center md:justify-start">
                <div className="p-2 bg-brand-gray-50 rounded-lg text-brand-gray-900">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div>
                    <h4 className="text-sm font-bold text-brand-gray-900">Envíos Globales</h4>
                    <p className="text-xs text-brand-gray-500">Rastreo en tiempo real</p>
                </div>
            </div>

            {/* Item 3: Guarantee */}
            <div className="flex items-center gap-3 justify-center md:justify-start">
                <div className="p-2 bg-brand-gray-50 rounded-lg text-brand-gray-900">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div>
                    <h4 className="text-sm font-bold text-brand-gray-900">Garantía Total</h4>
                    <p className="text-xs text-brand-gray-500">Satisfacción asegurada</p>
                </div>
            </div>
        </div>
    );
}
