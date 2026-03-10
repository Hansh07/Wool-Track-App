import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Loader2, AlertCircle, Tractor, Factory, ClipboardCheck, ShoppingBag } from 'lucide-react';
import AuthLayout from '../layouts/AuthLayout';

const fieldVariants = {
    hidden: { opacity: 0, y: 14 },
    show: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07 + 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] } }),
};

// Role option data
const ROLES = [
    { value: 'FARMER', label: 'Farmer', icon: Tractor, color: 'emerald', desc: 'Raise & sell wool' },
    { value: 'MILL_OPERATOR', label: 'Mill Operator', icon: Factory, color: 'blue', desc: 'Process wool batches' },
    { value: 'QUALITY_INSPECTOR', label: 'Inspector', icon: ClipboardCheck, color: 'purple', desc: 'Grade & certify' },
    { value: 'BUYER', label: 'Buyer', icon: ShoppingBag, color: 'amber', desc: 'Purchase from market' },
];

const colorMap = {
    emerald: { border: 'border-primary-400', bg: 'bg-primary-50', text: 'text-primary-600', glow: 'rgba(165,153,201,0.2)' },
    blue: { border: 'border-blue-400', bg: 'bg-blue-50', text: 'text-blue-600', glow: 'rgba(59,130,246,0.2)' },
    purple: { border: 'border-purple-400', bg: 'bg-purple-50', text: 'text-purple-600', glow: 'rgba(168,85,247,0.2)' },
    amber: { border: 'border-amber-400', bg: 'bg-amber-50', text: 'text-amber-600', glow: 'rgba(245,158,11,0.2)' },
};

const RegisterPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'FARMER' });
    const { register } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [focused, setFocused] = useState('');

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            await register(formData.name, formData.email, formData.password, formData.role);
            navigate('/');
        } catch (err) {
            const data = err.response?.data;
            const msg = data?.errors?.[0]?.message || data?.message || 'Registration failed. Please try again.';
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    const inputClass = (name) =>
        `flex h-12 w-full rounded-xl border bg-white pl-11 pr-4 py-2 text-sm text-gray-800 placeholder:text-gray-400 outline-none transition-all duration-200 ${focused === name
            ? 'border-primary-500 shadow-[0_0_0_3px_rgba(165,153,201,0.15)] bg-white'
            : 'border-gray-300 hover:border-gray-400'
        }`;

    return (
        <AuthLayout
            title="Create Account"
            subtitle="Join the modern wool supply chain platform"
        >
            <div className="glass-ultra rounded-2xl p-7 space-y-5">
                {/* Error */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className="p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-sm flex items-center gap-2.5"
                    >
                        <AlertCircle size={15} className="flex-shrink-0" />
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Full Name */}
                    <motion.div custom={0} variants={fieldVariants} initial="hidden" animate="show" className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                            <input
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                onFocus={() => setFocused('name')}
                                onBlur={() => setFocused('')}
                                required
                                placeholder="John Doe"
                                className={inputClass('name')}
                            />
                        </div>
                    </motion.div>

                    {/* Email */}
                    <motion.div custom={1} variants={fieldVariants} initial="hidden" animate="show" className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                            <input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                onFocus={() => setFocused('email')}
                                onBlur={() => setFocused('')}
                                required
                                placeholder="name@company.com"
                                className={inputClass('email')}
                            />
                        </div>
                    </motion.div>

                    {/* Password */}
                    <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="show" className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                            <input
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                onFocus={() => setFocused('password')}
                                onBlur={() => setFocused('')}
                                required
                                placeholder="Min 8 chars, A-Z, a-z, 0-9"
                                className={inputClass('password')}
                            />
                        </div>
                        <p className="text-xs text-gray-500 ml-1">Uppercase, lowercase &amp; number required</p>
                    </motion.div>

                    {/* Role picker — visual cards */}
                    <motion.div custom={3} variants={fieldVariants} initial="hidden" animate="show" className="space-y-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Your Role</label>
                        <div className="grid grid-cols-2 gap-2">
                            {ROLES.map(({ value, label, icon: Icon, color, desc }) => {
                                const active = formData.role === value;
                                const c = colorMap[color];
                                return (
                                    <motion.button
                                        key={value}
                                        type="button"
                                        onClick={() => setFormData(p => ({ ...p, role: value }))}
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        className={`relative flex flex-col items-center gap-1.5 p-3 rounded-xl border text-left transition-all duration-200 ${active
                                            ? `${c.border} ${c.bg}`
                                            : 'border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300'
                                            }`}
                                        style={active ? { boxShadow: `0 0 20px ${c.glow}` } : {}}
                                    >
                                        <Icon size={20} className={active ? c.text : 'text-gray-400'} />
                                        <span className={`text-xs font-semibold ${active ? c.text : 'text-gray-600'}`}>{label}</span>
                                        <span className="text-[10px] text-gray-500 text-center leading-tight">{desc}</span>
                                        {active && (
                                            <motion.div
                                                layoutId="roleActiveRing"
                                                className={`absolute inset-0 rounded-xl border-2 ${c.border}`}
                                                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                                            />
                                        )}
                                    </motion.button>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* Submit */}
                    <motion.div custom={4} variants={fieldVariants} initial="hidden" animate="show">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-neon w-full h-12 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 mt-1 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                            style={{
                                background: isLoading ? 'rgba(31,97,49,0.5)' : 'linear-gradient(135deg, #1F6131, #13401F)',
                                color: '#fff',
                                boxShadow: '0 4px 20px rgba(31,97,49,0.25)',
                            }}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Creating account…
                                </>
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </motion.div>
                </form>

                {/* Footer */}
                <motion.div
                    custom={5} variants={fieldVariants} initial="hidden" animate="show"
                    className="text-center text-sm text-gray-500 pt-1 border-t border-gray-100"
                >
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold transition-colors">
                        Sign In
                    </Link>
                </motion.div>
            </div>
        </AuthLayout>
    );
};

export default RegisterPage;
