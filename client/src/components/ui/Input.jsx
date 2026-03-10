import React from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

const Input = React.forwardRef(({ className, type, label, error, icon: Icon, ...props }, ref) => {
    return (
        <div className="space-y-2 w-full">
            {label && <label className="text-sm font-medium text-gray-700 ml-1">{label}</label>}
            <div className="relative group">
                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-600 transition-colors">
                        <Icon size={18} />
                    </div>
                )}
                <input
                    type={type}
                    className={cn(
                        "flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:border-primary-500 focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 text-gray-800",
                        Icon && "pl-10",
                        error && "border-red-500 focus-visible:ring-red-500",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {/* Animated bottom border glow */}
                <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-primary-500 transition-all duration-300 group-focus-within:w-full" />
            </div>
            {error && <p className="text-xs text-red-400 ml-1">{error}</p>}
        </div>
    );
});

Input.displayName = "Input";

export { Input };
