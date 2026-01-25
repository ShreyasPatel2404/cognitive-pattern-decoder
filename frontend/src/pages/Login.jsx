import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Brain, Lock, Mail, ArrowRight } from 'lucide-react';
import clsx from 'clsx';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to login');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-dark-800 border border-dark-border rounded-sm shadow-2xl p-8">
                <div className="flex flex-col items-center mb-8">
                    <div className="p-3 bg-primary-500/10 rounded-full mb-4">
                        <Brain className="text-primary-500" size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-100 tracking-tight">Welcome Back</h1>
                    <p className="text-gray-400 text-sm mt-1">Sign in to your Cognitive Decoder</p>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-danger/10 border border-danger/20 rounded text-danger text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-dark-900 border border-dark-border rounded p-2.5 pl-10 text-gray-200 focus:outline-none focus:border-primary-500 transition-colors"
                                placeholder="name@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-dark-900 border border-dark-border rounded p-2.5 pl-10 text-gray-200 focus:outline-none focus:border-primary-500 transition-colors"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={clsx(
                            "w-full bg-primary-600 hover:bg-primary-500 text-white font-medium py-2.5 rounded transition-all flex items-center justify-center gap-2",
                            isSubmitting && "opacity-70 cursor-not-allowed"
                        )}
                    >
                        {isSubmitting ? "Signing in..." : <>Sign In <ArrowRight size={18} /></>}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-500">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-primary-500 hover:text-primary-400 font-medium">
                        Create account
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
