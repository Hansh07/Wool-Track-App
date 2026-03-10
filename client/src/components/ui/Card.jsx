import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const Card = React.forwardRef(({ className, children, hoverEffect = true, glowColor = 'evergreen', ...props }, ref) => {
    const glowMap = {
        evergreen: 'rgba(16,60,31,0.25)',
        lime: 'rgba(111,191,75,0.25)',
        blue: 'rgba(142,126,181,0.15)',
    };
    const glow = glowMap[glowColor] || glowMap.evergreen;

    return (
        <motion.div
            ref={ref}
            initial={hoverEffect ? { y: 0 } : undefined}
            whileHover={
                hoverEffect
                    ? {
                        y: -6,
                        boxShadow: `0 10px 30px ${glow}, 0 0 0 1px rgba(16,60,31,0.15)`,
                        borderColor: 'rgba(16,60,31,0.3)',
                    }
                    : undefined
            }
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            className={cn(
                'rounded-2xl border border-border bg-white p-6 shadow-card',
                'transition-colors duration-300 text-textPrimary',
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
});

Card.displayName = 'Card';

export { Card };
