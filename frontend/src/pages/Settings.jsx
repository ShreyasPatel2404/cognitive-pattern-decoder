import React, { useState, useEffect } from 'react';
import { userService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { User, Save, CheckCircle, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

const Settings = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState({
        name: '',
        email: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: '' }

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;
            try {
                const data = await userService.getProfile();
                setProfile({
                    name: data.name || '',
                    email: data.email || ''
                });
            } catch (err) {
                setMessage({ type: 'error', text: 'Failed to load profile' });
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user]);

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);
        try {
            await userService.updateProfile({
                name: profile.name
            });
            setMessage({ type: 'success', text: 'Settings saved successfully' });

            // Clear success message after 3 seconds
            setTimeout(() => setMessage(null), 3000);
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to update settings' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-center p-8 text-gray-400">Loading Settings...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-100 tracking-tight">Settings</h1>

            {message && (
                <div className={clsx(
                    "p-4 rounded border flex items-center gap-2",
                    message.type === 'success' ? "bg-success/10 border-success/30 text-success" : "bg-danger/10 border-danger/30 text-danger"
                )}>
                    {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Profile Section - Centered or Full Width if single */}
                <div className="bg-dark-800 border border-dark-border rounded-sm p-6 lg:col-span-2">
                    <h3 className="text-gray-200 font-bold mb-4 flex items-center gap-2">
                        <User size={20} className="text-primary-500" />
                        Profile Information
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={profile.name}
                                onChange={handleChange}
                                className="w-full bg-dark-900 border border-dark-border rounded p-2.5 text-gray-200 focus:outline-none focus:border-primary-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">Email Address</label>
                            <input
                                type="email"
                                value={profile.email}
                                disabled
                                className="w-full bg-dark-900/50 border border-dark-border rounded p-2.5 text-gray-500 cursor-not-allowed"
                            />
                            <p className="text-xs text-gray-600 mt-1">Email cannot be changed.</p>
                        </div>
                    </form>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-500 text-white font-medium rounded transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    <Save size={18} />
                    {saving ? "Saving Changes..." : "Save Changes"}
                </button>
            </div>
        </div>
    );
};

export default Settings;
