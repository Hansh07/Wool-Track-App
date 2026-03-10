import React from 'react';
import { motion } from 'framer-motion';
import logo from '../assets/logo.png';

const AuthLayout = ({ children, title, subtitle }) => {
    return (
        <div className="min-h-screen w-full relative overflow-hidden bg-background flex items-center justify-center p-4">

            {/* ── Light background orbs ── */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {/* Top-left cadet blue orb */}
                <motion.div
                    className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full"
                    style={{ background: 'radial-gradient(circle, rgba(31,97,49,0.08) 0%, transparent 70%)', filter: 'blur(70px)' }}
                    animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                />
                {/* Bottom-right mint orb */}
                <motion.div
                    className="absolute -bottom-40 -right-20 w-[480px] h-[480px] rounded-full"
                    style={{ background: 'radial-gradient(circle, rgba(142,217,104,0.08) 0%, transparent 70%)', filter: 'blur(80px)' }}
                    animate={{ scale: [1.1, 1, 1.1], opacity: [0.5, 0.85, 0.5] }}
                    transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                />
                {/* Centre soft teal ghost */}
                <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full"
                    style={{ background: 'radial-gradient(circle, rgba(142,217,104,0.15) 0%, transparent 65%)', filter: 'blur(80px)' }}
                    animate={{ opacity: [0.5, 0.9, 0.5] }}
                    transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                />

                {/* Dot-grid pattern */}
                <div className="absolute inset-0 opacity-[0.4]"
                    style={{
                        backgroundImage: 'radial-gradient(rgba(31,97,49,0.18) 1px, transparent 1px)',
                        backgroundSize: '28px 28px',
                    }}
                />

                {/* Horizontal light streak */}
                <motion.div
                    className="absolute top-1/3 left-0 right-0 h-px"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(31,97,49,0.1), transparent)' }}
                    animate={{ opacity: [0, 1, 0], scaleX: [0.3, 1, 0.3] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                />
            </div>

            {/* ── Card container ── */}
            <motion.div
                initial={{ opacity: 0, y: 28, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 w-full max-w-md"
            >
                {/* Logo + brand */}
                <div className="text-center mb-8">
                    <motion.div
                        className="flex flex-col items-center mb-5"
                        initial={{ opacity: 0, y: -14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <motion.img
                            src={logo}
                            alt="Wool Track"
                            className="h-20 w-auto object-contain drop-shadow-2xl mb-3"
                            animate={{ y: [0, -6, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                        />
                        <span className="font-display font-bold text-2xl tracking-tight"
                            style={{ background: 'linear-gradient(135deg,#1F6131,#13401F)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            Wool Track
                        </span>
                    </motion.div>

                    <motion.h1
                        className="text-2xl font-bold tracking-tight text-gray-800 mb-2 font-display"
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.22 }}
                    >
                        {title || 'Welcome Back'}
                    </motion.h1>

                    {subtitle && (
                        <motion.p
                            className="text-gray-500 text-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.32 }}
                        >
                            {subtitle}
                        </motion.p>
                    )}
                </div>

                {/* Glowing border wrapper around children */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.38, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="relative"
                >
                    {/* Subtle evergreen rim glow behind the card */}
                    <div className="absolute -inset-px rounded-2xl"
                        style={{ background: 'linear-gradient(135deg, rgba(31,97,49,0.08), transparent 60%, rgba(142,217,104,0.05))', borderRadius: 'inherit', zIndex: -1 }} />
                    {children}
                </motion.div>

                {/* Footer */}
                <motion.p
                    className="text-center text-xs text-gray-500 mt-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.55 }}
                >
                    © 2025 Wool Track · Secure &amp; Encrypted
                </motion.p>
            </motion.div>
        </div>
    );
};

export default AuthLayout;
