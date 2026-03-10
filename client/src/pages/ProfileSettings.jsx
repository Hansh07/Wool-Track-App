import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, MapPin, CreditCard, Save } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';

const ProfileSettings = () => {
    const { user } = useAuth();

    return (
        <DashboardLayout>
            <div className="max-w-2xl mx-auto space-y-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Profile Settings</h1>

                <Card>
                    <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-100">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold shadow-neon">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
                            <p className="text-gray-500 mb-2">{user.email}</p>
                            <Badge variant="neutral">{user.role}</Badge>
                        </div>
                    </div>

                    <form className="space-y-6">
                        <Input
                            label="Farm / Business Name"
                            defaultValue={user.name}
                            icon={User}
                        />

                        <div>
                            <label className="text-sm font-medium text-gray-700 ml-1 mb-1 flex items-center gap-2">
                                <MapPin size={16} className="text-primary-600" /> Address
                            </label>
                            <textarea
                                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-800 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500/50"
                                rows="3"
                                placeholder="Enter address..."
                            />
                        </div>

                        <Input
                            label="Payment Details (IBAN / UPI)"
                            placeholder="Enter account details"
                            icon={CreditCard}
                        />

                        <div className="pt-4 flex justify-end">
                            <Button>
                                <Save size={18} className="mr-2" /> Save Changes
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default ProfileSettings;
