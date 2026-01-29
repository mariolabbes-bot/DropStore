
import React from 'react';

interface VerifiedBadgeProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg';
    showText?: boolean;
}

export default function VerifiedBadge({ className = '', size = 'md', showText = false }: VerifiedBadgeProps) {
    const sizeClasses = {
        sm: 'w-6 h-6',
        md: 'w-8 h-8',
        lg: 'w-12 h-12'
    };

    return (
        <div className={`inline-flex items-center gap-2 group relative ${className}`} title="Producto Verificado por DropStore">
            {/* Rosette SVG */}
            <div className={`relative flex items-center justify-center drop-shadow-md hover:scale-110 transition-transform duration-300 ${sizeClasses[size]}`}>
                {/* Starburst/Rosette Shape */}
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-yellow-400">
                    <path d="M12 2L14.85 4.54L18.49 3.86L19.23 7.5L22.61 9.25L20.84 12.63L22.61 16.02L19.23 17.77L18.49 21.41L14.85 20.73L12 23.27L9.15 20.73L5.51 21.41L4.77 17.77L1.39 16.02L3.16 12.63L1.39 9.25L4.77 7.5L5.51 3.86L9.15 4.54L12 2Z" fill="currentColor" />
                    <path d="M12 2L14.85 4.54L18.49 3.86L19.23 7.5L22.61 9.25L20.84 12.63L22.61 16.02L19.23 17.77L18.49 21.41L14.85 20.73L12 23.27L9.15 20.73L5.51 21.41L4.77 17.77L1.39 16.02L3.16 12.63L1.39 9.25L4.77 7.5L5.51 3.86L9.15 4.54L12 2Z" stroke="#B45309" strokeWidth="1" strokeLinejoin="round" />
                </svg>
                {/* Checkmark */}
                <svg className="absolute w-[40%] h-[40%] text-yellow-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
            </div>

            {showText && (
                <div className="flex flex-col leading-none">
                    <span className="text-[10px] font-black text-yellow-600 uppercase tracking-widest">Verificado</span>
                    <span className="text-[8px] font-bold text-brand-gray-500">por DropStore</span>
                </div>
            )}

            {/* Tooltip for small sizes */}
            {!showText && (
                <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 w-max max-w-[150px] bg-brand-gray-900 text-white text-[10px] p-2 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                    <p className="font-bold text-yellow-400 mb-1">✓ Verificado</p>
                    Producto probado por DropStore.
                    {/* Arrow */}
                    <div className="absolute top-1/2 -translate-y-1/2 -right-1 w-2 h-2 bg-brand-gray-900 rotate-45"></div>
                </div>
            )}
        </div>
    );
}
