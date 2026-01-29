
import React from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import VerifiedBadge from './ui/VerifiedBadge';

interface ProductCardProps {
    product: {
        id: number;
        title: string;
        price: number;
        image?: string | null;
        verified?: boolean;
    };
}

export default function ProductCard({ product }: ProductCardProps) {
    const { addItem } = useCart();

    return (
        <div className="group relative flex flex-col h-full bg-white rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-brand-gray-100/50 hover:border-secondary/20">
            <Link href={`/products/${product.id}`} className="block relative aspect-[4/5] overflow-hidden bg-brand-gray-50">
                {product.image ? (
                    <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-brand-gray-300 font-medium">
                        Sin Imagen
                    </div>
                )}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {product.verified && (
                    <div className="absolute top-3 right-3 z-10">
                        <VerifiedBadge size="md" />
                    </div>
                )}
            </Link>

            <div className="p-6 flex flex-col flex-grow space-y-4">
                <div className="space-y-1">
                    <h3 className="font-bold text-brand-gray-900 line-clamp-2 leading-tight min-h-[2.5rem] group-hover:text-secondary transition-colors text-lg">
                        <Link href={`/products/${product.id}`}>
                            {product.title}
                        </Link>
                    </h3>
                    <p className="text-sm text-brand-gray-400 font-medium">AliExpress Global</p>
                </div>

                <div className="mt-auto flex items-center justify-between pt-2">
                    <span className="text-2xl font-black text-brand-gray-900 tracking-tight">
                        ${(product.price / 100).toFixed(2)}
                    </span>
                    <button
                        onClick={() => addItem(product)}
                        className="h-12 w-12 bg-primary text-white rounded-2xl flex items-center justify-center hover:bg-secondary transition-all active:scale-90 shadow-lg shadow-primary/10 hover:shadow-secondary/20"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
