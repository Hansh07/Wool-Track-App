import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from './context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown } from 'lucide-react';
import logo from './assets/logo.png';
import WoolParticles from './components/WoolParticles';

// Page imports
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BatchesList from './pages/BatchesList';
import CreateBatch from './pages/CreateBatch';
import BatchDetail from './pages/BatchDetail';
import AdminPanel from './pages/AdminPanel';
import FarmerDashboard from './pages/FarmerDashboard';
import QualityResults from './pages/QualityResults';
import ProfileSettings from './pages/ProfileSettings';
import OperatorDashboard from './pages/OperatorDashboard';
import MonitoringDashboard from './pages/MonitoringDashboard';
import InspectorDashboard from './pages/InspectorDashboard';
import InspectionForm from './pages/InspectionForm';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import Marketplace from './pages/Marketplace';
import MyOrders from './pages/MyOrders';
import AuctionPage from './pages/AuctionPage';
import LogisticsPage from './pages/LogisticsPage';
import CertificatesPage from './pages/CertificatesPage';
import InventoryPage from './pages/InventoryPage';
import ESGDashboard from './pages/ESGDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Chatbot from './components/Chatbot';
import HomePage from './pages/HomePage';

// Language switcher component
const LanguageSwitcher = () => {
    const { i18n } = useTranslation();
    const [open, setOpen] = useState(false);
    const langs = [{ code: 'en', label: 'EN', name: 'English' }, { code: 'hi', label: 'HI', name: 'Hindi' }, { code: 'pa', label: 'PA', name: 'Punjabi' }];
    const current = langs.find(l => l.code === i18n.language) || langs[0];
    return (
        <div className="relative">
            <button onClick={() => setOpen(p => !p)} className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-all">
                <Globe size={14} />
                <span>{current.label}</span>
                <ChevronDown size={12} />
            </button>
            {open && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-card overflow-hidden z-50 min-w-[120px]">
                    {langs.map(lang => (
                        <button key={lang.code} onClick={() => { i18n.changeLanguage(lang.code); setOpen(false); }} className={'w-full text-left px-4 py-2.5 text-sm transition-colors ' + (i18n.language === lang.code ? 'text-primary-600 font-semibold bg-primary-50' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900')}>
                            {lang.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

const Navbar = () => {
    const { user } = useAuth();
    const { t } = useTranslation();
    const location = useLocation();
    // Authenticated users get navigation from DashboardLayout sidebar — hide this old navbar
    if (user) return null;
    if (['/login', '/register'].includes(location.pathname)) return null;
    // Public homepage only
    return (
        <nav className="border-b border-gray-200 bg-white/90 backdrop-blur-md sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2.5">
                    <img src={logo} alt="WoolMonitor" className="h-10 w-auto object-contain drop-shadow-md" />
                    <span className="text-lg font-bold text-gray-800 font-display">Wool Track</span>
                </Link>
                <div className="flex items-center gap-3">
                    <LanguageSwitcher />
                    <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2 rounded-xl hover:bg-gray-100 transition-all">{t('nav.login')}</Link>
                    <Link to="/register" className="btn-primary text-sm py-2 px-5 rounded-xl">{t('nav.register')}</Link>
                </div>
            </div>
        </nav>
    );
};

const HomeRoute = () => {
    const { user } = useAuth();
    if (!user) return <HomePage />;
    if (user.role === 'FARMER') return <FarmerDashboard />;
    if (user.role === 'MILL_OPERATOR') return <OperatorDashboard />;
    if (user.role === 'QUALITY_INSPECTOR') return <InspectorDashboard />;
    if (user.role === 'BUYER') return <Marketplace />;
    return <BatchesList />;
};

const PublicHomeWrapper = () => {
    const { loading } = useAuth();
    if (loading) return <div className="flex h-screen items-center justify-center"><div className="spinner w-12 h-12" /></div>;
    return <HomeRoute />;
};

function App() {
    const location = useLocation();
    return (
        <div className="min-h-screen bg-background text-white font-sans">
            {/* Floating wool fiber particles — fixed behind everything */}
            <WoolParticles />

            <Navbar />

            <AnimatePresence mode="wait">
                <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                >
                    <Routes location={location}>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/" element={<PublicHomeWrapper />} />

                        <Route path="/quality-results" element={<ProtectedRoute permission="view_quality_results"><QualityResults /></ProtectedRoute>} />
                        <Route path="/profile" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} />
                        <Route path="/monitoring" element={<ProtectedRoute permission="access_monitoring_dashboard"><MonitoringDashboard /></ProtectedRoute>} />
                        <Route path="/quality/analytics" element={<ProtectedRoute permission="view_quality_analytics"><AnalyticsDashboard /></ProtectedRoute>} />
                        <Route path="/inspect/:id" element={<ProtectedRoute permission="create_quality_inspection"><InspectionForm /></ProtectedRoute>} />
                        <Route path="/create-batch" element={<ProtectedRoute permission="create_batch"><CreateBatch /></ProtectedRoute>} />
                        <Route path="/batches" element={<ProtectedRoute><BatchesList /></ProtectedRoute>} />
                        <Route path="/batches/:id" element={<ProtectedRoute><BatchDetail /></ProtectedRoute>} />
                        <Route path="/marketplace" element={<ProtectedRoute permission="view_products"><Marketplace /></ProtectedRoute>} />
                        <Route path="/orders" element={<ProtectedRoute permission="view_order_history"><MyOrders /></ProtectedRoute>} />
                        <Route path="/admin" element={<ProtectedRoute role="ADMIN"><AdminPanel /></ProtectedRoute>} />

                        {/* Enterprise Routes */}
                        <Route path="/auction" element={<ProtectedRoute permission="view_auction"><AuctionPage /></ProtectedRoute>} />
                        <Route path="/logistics" element={<ProtectedRoute permission="view_logistics"><LogisticsPage /></ProtectedRoute>} />
                        <Route path="/certificates" element={<ProtectedRoute permission="view_certificates"><CertificatesPage /></ProtectedRoute>} />
                        <Route path="/inventory" element={<ProtectedRoute permission="view_inventory"><InventoryPage /></ProtectedRoute>} />
                        <Route path="/esg" element={<ProtectedRoute permission="view_esg_reports"><ESGDashboard /></ProtectedRoute>} />

                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </motion.div>
            </AnimatePresence>

            <Chatbot />
        </div>
    );
}

export default App;
