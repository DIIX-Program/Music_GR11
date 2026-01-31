import { useState } from 'react';
import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuthStore();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            await login(formData);
            navigate('/app');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid credentials');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
            <Link to="/" className="absolute top-8 left-8 font-bold text-lg hover:opacity-80 transition-opacity">
                StreamFlow
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-xl p-8"
            >
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
                    <p className="text-zinc-400 text-sm">Log in to continue</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">Username</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-colors"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-colors"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 text-zinc-500 hover:text-white text-xs"
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-green-500 text-black font-bold py-3 rounded-lg mt-4 hover:bg-green-400 transition-colors disabled:opacity-50"
                    >
                        {isSubmitting ? 'Logging in...' : 'Log In'}
                    </button>
                </form>

                <div className="text-center mt-6 space-y-2">
                    <Link to="/forgot-password" className="text-zinc-400 hover:text-white text-sm block">
                        Forgot password?
                    </Link>
                    <p className="text-zinc-500 text-sm">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-green-500 hover:underline font-medium">
                            Sign up
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
