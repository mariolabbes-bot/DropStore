
import React, { useState } from 'react';

interface VerifiedBadgeProps {
    size?: 'sm' | 'md' | 'lg';
    showText?: boolean;
}

const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({ size = 'md', showText = false }) => {
    const [isOpen, setIsOpen] = useState(false);

    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8',
    };

    const textSizes = {
        sm: 'text-[10px]',
        md: 'text-xs',
        lg: 'text-sm',
    };

    return (
        <div
            className="relative group inline-flex items-center"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
            onClick={() => setIsOpen(!isOpen)}
        >
            <div className="cursor-help inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-md border border-yellow-200 rounded-full pr-3 pl-1 py-1 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300">
                <div className={`relative flex items-center justify-center bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full text-white shadow-inner ${sizeClasses[size]}`}>
                    <svg className="w-[60%] h-[60%]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                {(showText || size !== 'sm') && (
                    <span className={`font-black text-brand-gray-900 uppercase tracking-tight leading-none ${textSizes[size]}`}>
                        <span className="text-yellow-600">Certificado</span>
                    </span>
                )}
            </div>

            {/* Tooltip / Balloon */}
            <div className={`absolute top-full right-0 mt-3 w-64 p-4 bg-white rounded-2xl shadow-2xl border border-brand-gray-100 transform origin-top-right transition-all duration-300 z-50 ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}>
                {/* Arrow */}
                <div className="absolute -top-2 right-6 w-4 h-4 bg-white border-t border-l border-brand-gray-100 transform rotate-45"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">✨</span>
                        <h4 className="font-bold text-brand-gray-900 text-sm">Calidad Garantizada</h4>
                    </div>
                    <p className="text-xs text-brand-gray-500 leading-relaxed">
                        Este producto ha sido <strong className="text-brand-gray-800">comprado y probado personalmente</strong> por nuestro equipo.
                    </p>
                    <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg text-[10px] font-bold">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Aprobado para venta</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifiedBadge;
