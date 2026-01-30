
import React from 'react';

interface VerifiedBadgeProps {
    size?: 'sm' | 'md' | 'lg';
    showText?: boolean;
}

const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({ size = 'md', showText = false }) => {
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
        <div className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-sm border border-brand-gray-100 rounded-full pr-3 pl-1 py-1 shadow-sm" title="Calidad Certificada por DropStore">
            <div className={`relative flex items-center justify-center bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full text-white shadow-inner ${sizeClasses[size]}`}>
                <svg className="w-[60%] h-[60%]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
            </div>
            {(showText || size !== 'sm') && (
                <span className={`font-bold text-brand-gray-800 uppercase tracking-tight leading-none ${textSizes[size]}`}>
                    <span className="text-yellow-600">Certificado</span>
                </span>
            )}
        </div>
    );
};

export default VerifiedBadge;
