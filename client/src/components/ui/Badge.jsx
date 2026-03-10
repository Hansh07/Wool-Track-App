import React from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

const Badge = ({ children, variant = 'primary', className }) => {
    const variants = {
        primary: 'bg-primary-100 text-primary-700 border-primary-200',
        success: 'bg-green-100 text-green-700 border-green-200',
        warning: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        danger: 'bg-red-100 text-red-700 border-red-200',
        neutral: 'bg-gray-100 text-gray-600 border-gray-300',
        outline: 'border-gray-300 text-gray-600',
    };

    return (
        <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
                'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                variants[variant],
                className
            )}
        >
            {children}
        </motion.span>
    );
};

export { Badge };
