import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import logo from '../assets/logo.png';
import videoBg from '../assets/sheepvid.mp4';
import {
    ArrowRight,
    ShieldCheck,
    TrendingUp,
    Activity,
    Truck,
    ClipboardCheck,
    BarChart2,
    ShoppingBag,
    Globe,
    Mail,
    Phone,
    Users
} from 'lucide-react';

const HomePage = () => {
    return (
        <div className="flex flex-col min-h-screen bg-white text-gray-800">

            {/* ── Hero Section ───────────────────────────────── */}
            <div className="relative h-screen flex flex-col items-center justify-center text-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-black/65 z-10" />
                    <video src={videoBg} autoPlay loop muted className="w-full h-full object-cover" />
                </div>

                <div className="relative z-20 px-4 max-w-5xl mx-auto space-y-8">
                    <div className="flex justify-center mb-2">
                        <img src={logo} alt="Wool Track" className="h-20 w-auto object-contain drop-shadow-2xl" />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight">
                        Standardising the{' '}
                        <span className="text-primary-400">Wool Supply Chain</span>
                    </h1>
                    <p className="text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
                        A comprehensive platform for Farmers, Mill Operators, and Quality Inspectors to track, grade, and trade wool efficiently.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                        <Link to="/login">
                            <Button size="xl" className="w-full sm:w-auto text-lg px-8 py-4 shadow-neon">
                                Login to Portal <ArrowRight className="ml-2" />
                            </Button>
                        </Link>
                        <Link to="/register">
                            <Button variant="secondary" size="xl" className="w-full sm:w-auto text-lg px-8 py-4 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 text-white">
                                Create Account
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce">
                    <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
                        <div className="w-1 h-2 bg-white/60 rounded-full mt-2" />
                    </div>
                </div>
            </div>

            {/* ── Features Section ───────────────────────────── */}
            <section className="py-20 bg-gray-50 border-t border-gray-100">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Why Choose Wool Track?</h2>
                        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                            Modernizing an age-old industry with cutting-edge technology and transparency.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Activity className="text-primary-600" size={36} />}
                            title="Real-time Tracking"
                            description="Monitor every batch from the farm to the finished product with granular stage tracking."
                        />
                        <FeatureCard
                            icon={<ShieldCheck className="text-emerald-500" size={36} />}
                            title="Quality Assurance"
                            description="Integrated lab capabilities for inspectors to grade and certify wool quality instantly."
                        />
                        <FeatureCard
                            icon={<TrendingUp className="text-purple-500" size={36} />}
                            title="Marketplace Insights"
                            description="Connect directly with buyers and access real-time market pricing trends."
                        />
                    </div>
                </div>
            </section>

            {/* ── Roles Section ──────────────────────────────── */}
            <section className="py-20 bg-white border-t border-gray-100">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Empowering Every Stakeholder</h2>
                        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                            Tailored tools for every role in the ecosystem.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <RoleCard
                            icon={<Users className="text-emerald-500" size={32} />}
                            title="Farmers"
                            color="emerald"
                            description="Submit batches, track processing, and view earnings directly."
                        />
                        <RoleCard
                            icon={<Truck className="text-blue-500" size={32} />}
                            title="Mill Operators"
                            color="blue"
                            description="Manage intake, processing stages (Cleaning, Carding), and inventory."
                        />
                        <RoleCard
                            icon={<ClipboardCheck className="text-teal-500" size={32} />}
                            title="Inspectors"
                            color="teal"
                            description="Conduct quality tests and issue digital certificates for batches."
                        />
                        <RoleCard
                            icon={<ShoppingBag className="text-indigo-500" size={32} />}
                            title="Buyers"
                            color="indigo"
                            description="Browse certified wool batches and place orders seamlessly."
                        />
                    </div>
                </div>
            </section>

            {/* ── Stats Bar ──────────────────────────────────── */}
            <section className="py-12 bg-primary-50 border-t border-primary-100">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { value: '10,000+', label: 'Batches Tracked' },
                            { value: '500+', label: 'Active Farmers' },
                            { value: '50+', label: 'Mill Partners' },
                            { value: '₹2Cr+', label: 'Transactions Processed' },
                        ].map(stat => (
                            <div key={stat.label}>
                                <p className="text-3xl font-bold text-primary-600">{stat.value}</p>
                                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA Section ────────────────────────────────── */}
            <section className="py-20 bg-gradient-to-br from-primary-50 to-white border-t border-gray-100 text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Ready to Get Started?</h2>
                    <p className="text-xl text-gray-500 mb-8 max-w-2xl mx-auto">
                        Join stakeholders across India standardizing the wool industry today.
                    </p>
                    <Link to="/register">
                        <Button size="xl" className="shadow-neon text-lg px-10 py-4">
                            Create Your Free Account <ArrowRight className="ml-2" />
                        </Button>
                    </Link>
                </div>
            </section>

            {/* ── Footer ─────────────────────────────────────── */}
            <footer className="bg-gray-50 border-t border-gray-100 text-gray-500 py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <img src={logo} alt="Logo" className="h-9 w-auto" />
                                <span className="text-gray-800 font-bold text-lg">Wool Track</span>
                            </div>
                            <p className="text-sm">
                                Standardizing the Indian wool supply chain with transparency and efficiency.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-gray-800 font-semibold mb-4">Quick Links</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link to="/" className="hover:text-primary-600 transition">Home</Link></li>
                                <li><Link to="/login" className="hover:text-primary-600 transition">Login</Link></li>
                                <li><Link to="/register" className="hover:text-primary-600 transition">Register</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-gray-800 font-semibold mb-4">Resources</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="hover:text-primary-600 transition">Documentation</a></li>
                                <li><a href="#" className="hover:text-primary-600 transition">Pricing</a></li>
                                <li><a href="#" className="hover:text-primary-600 transition">Support</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-gray-800 font-semibold mb-4">Contact</h4>
                            <ul className="space-y-2 text-sm">
                                <li className="flex items-center gap-2"><Mail size={14} /> support@wooltrack.in</li>
                                <li className="flex items-center gap-2"><Phone size={14} /> +91 98765 43210</li>
                                <li className="flex items-center gap-2"><Globe size={14} /> www.wooltrack.in</li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
                        <p>&copy; {new Date().getFullYear()} Wool Monitor Application. All rights reserved.</p>
                        <div className="flex gap-4 mt-4 md:mt-0">
                            <a href="#" className="hover:text-gray-800 transition">Privacy Policy</a>
                            <a href="#" className="hover:text-gray-800 transition">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const colorMap = {
    emerald: 'bg-emerald-50 border-emerald-200 hover:border-emerald-300',
    blue:    'bg-blue-50 border-blue-200 hover:border-blue-300',
    teal:    'bg-teal-50 border-teal-200 hover:border-teal-300',
    indigo:  'bg-indigo-50 border-indigo-200 hover:border-indigo-300',
};

const FeatureCard = ({ icon, title, description }) => (
    <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center hover:bg-gray-50 hover:border-gray-200 transition-all duration-300 group shadow-sm">
        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
        <p className="text-gray-500 leading-relaxed">{description}</p>
    </div>
);

const RoleCard = ({ icon, title, description, color }) => (
    <div className={`p-6 rounded-xl border ${colorMap[color]} transition-all duration-300 group cursor-default`}>
        <div className="mb-4">
            {icon}
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
    </div>
);

export default HomePage;
