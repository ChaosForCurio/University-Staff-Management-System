import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, ArrowRight, AlertCircle, Sparkles, User } from 'lucide-react';
import { cn } from '../utils/cn';

export const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(false);

        // Artificial delay for premium feel
        setTimeout(() => {
            if (login(email, password)) {
                const from = (location.state as any)?.from?.pathname || '/';
                navigate(from, { replace: true });
            } else {
                setError(true);
                setIsSubmitting(false);
            }
        }, 800);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0B1120] p-4 font-sans text-slate-100 overflow-hidden relative">
            {/* Dynamic Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[25%] -left-[10%] w-[70%] h-[70%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute -bottom-[25%] -right-[10%] w-[70%] h-[70%] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse [animation-delay:2s]" />
            </div>

            <div className="max-w-md w-full relative z-10">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 mb-6 shadow-2xl shadow-blue-500/20 rotate-3 transition-transform hover:rotate-0">
                        <div className="w-full h-full bg-[#0B1120] rounded-[22px] flex items-center justify-center">
                            <Shield className="w-10 h-10 text-white fill-blue-500/10" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight text-white mb-3">
                        Staff Portal
                    </h1>
                    <p className="text-slate-400 text-lg">
                        University Management System
                    </p>
                </div>

                <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-[32px] p-8 sm:p-10 shadow-3xl">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-slate-300 ml-1">
                                Email Address
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className="w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (error) setError(false);
                                    }}
                                    placeholder="Enter your email"
                                    className="block w-full pl-12 pr-4 py-4 bg-slate-950/50 border border-white/5 rounded-2xl text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                    required
                                    autoFocus
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium text-slate-300 ml-1">
                                Password
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className={cn(
                                        "w-5 h-5 transition-colors",
                                        error ? "text-red-400" : "text-slate-500 group-focus-within:text-blue-400"
                                    )} />
                                </div>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (error) setError(false);
                                    }}
                                    placeholder="Enter your password"
                                    className={cn(
                                        "block w-full pl-12 pr-4 py-4 bg-slate-950/50 border rounded-2xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 transition-all",
                                        error
                                            ? "border-red-500/50 focus:ring-red-500/20"
                                            : "border-white/5 focus:border-blue-500/50 focus:ring-blue-500/20"
                                    )}
                                    required
                                />
                            </div>
                            {error && (
                                <div className="flex items-center gap-2 text-red-400 text-sm mt-2 ml-1 animate-in fade-in slide-in-from-top-1">
                                    <AlertCircle className="w-4 h-4" />
                                    <span>Invalid credentials. Please try again.</span>
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="relative w-full overflow-hidden group h-14 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:scale-100"
                        >
                            <div className="relative z-10 flex items-center justify-center gap-2">
                                {isSubmitting ? (
                                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <span>Enter Portal</span>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </div>
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-white/5 text-center">
                        <p className="text-sm text-slate-500 flex items-center justify-center gap-2">
                            <Sparkles className="w-4 h-4 text-blue-400/50" />
                            Secure Enterprise Environment
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
