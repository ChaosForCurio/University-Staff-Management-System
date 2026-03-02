import React, { useState } from 'react';
import {
    Moon,
    Sun,
    Monitor,
    Shield,
    Fingerprint,
    Copy,
    Check,
    User,
    ShieldAlert,
    Palette
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/cn';

export const Settings: React.FC = () => {
    const { theme, setTheme } = useTheme();
    const { userUuid, userEmail, userRole, userData, generateUuid } = useAuth();
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (userUuid) {
            navigator.clipboard.writeText(userUuid);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                    <span className="text-gradient">Settings</span>
                </h1>
                <p className="mt-2 text-slate-500 dark:text-slate-400">Manage your account preferences and security settings.</p>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {/* Profile Section */}
                <section className="glass-panel rounded-2xl overflow-hidden border border-white/10 dark:border-slate-800/50">
                    <div className="px-6 py-5 border-b border-white/5 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-800/30">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <User className="h-5 w-5 text-indigo-500" />
                            Account Profile
                        </h3>
                    </div>
                    <div className="p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                            <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-extrabold shadow-xl shadow-indigo-500/20 ring-4 ring-white dark:ring-slate-900">
                                {userEmail?.charAt(0).toUpperCase()}
                            </div>
                            <div className="space-y-1 flex-1">
                                <div className="flex items-center gap-3">
                                    <h4 className="text-xl font-bold text-slate-900 dark:text-white">{userData?.displayName || userEmail?.split('@')[0]}</h4>
                                    <span className={cn(
                                        "px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-widest border",
                                        userRole === 'Admin'
                                            ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                            : "bg-slate-500/10 text-slate-500 border-slate-500/20"
                                    )}>
                                        {userRole}
                                    </span>
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 font-medium">{userEmail}</p>
                                <div className="flex items-center gap-4 mt-2">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Member Since</span>
                                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                            {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}
                                        </span>
                                    </div>
                                    <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />
                                    <div className="flex flex-col">
                                        <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Last Login</span>
                                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                            {userData?.lastLogin ? new Date(userData.lastLogin).toLocaleString() : 'Just now'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Appearance Section */}
                <section className="glass-panel rounded-2xl overflow-hidden border border-white/10 dark:border-slate-800/50">
                    <div className="px-6 py-5 border-b border-white/5 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-800/30">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Palette className="h-5 w-5 text-indigo-500" />
                            Performance & Theme
                        </h3>
                    </div>
                    <div className="p-6">
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium">
                            Customize the look and feel of your application with high-performance visuals.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {[
                                { id: 'light', icon: Sun, label: 'Light' },
                                { id: 'dark', icon: Moon, label: 'Dark' },
                                { id: 'system', icon: Monitor, label: 'System' }
                            ].map((item) => {
                                const Icon = item.icon;
                                const active = theme === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => setTheme(item.id as any)}
                                        className={cn(
                                            "flex flex-col items-center justify-center p-6 border-2 rounded-2xl transition-all duration-300 group relative overflow-hidden",
                                            active
                                                ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 dark:border-indigo-500/50 shadow-lg shadow-indigo-500/10"
                                                : "border-slate-100 dark:border-slate-800/60 text-slate-500 dark:text-slate-400 hover:border-indigo-300 dark:hover:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-800/50"
                                        )}
                                    >
                                        <Icon className={cn(
                                            "h-8 w-8 mb-3 transition-transform duration-500",
                                            active ? "scale-110 text-indigo-500" : "group-hover:scale-110"
                                        )} />
                                        <span className="font-bold text-sm tracking-wide">{item.label}</span>
                                        {active && (
                                            <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(79,70,229,0.8)]" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Security & Identity */}
                <section className="glass-panel rounded-2xl overflow-hidden border border-white/10 dark:border-slate-800/50">
                    <div className="px-6 py-5 border-b border-white/5 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-800/30">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Shield className="h-5 w-5 text-indigo-500" />
                            Security & Identity
                        </h3>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 group transition-all duration-300 hover:border-indigo-500/30">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 group-hover:scale-110 transition-transform">
                                    <Fingerprint className="h-6 w-6 text-indigo-500" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Unique Identifier</h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Your permanent digital identity in the system.</p>
                                </div>
                            </div>
                            <div className="flex flex-col sm:items-end gap-2">
                                {userUuid ? (
                                    <div className="flex items-center gap-2">
                                        <code className="px-3 py-1.5 rounded-lg bg-indigo-500/5 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-bold border border-indigo-500/10 tracking-tight">
                                            {userUuid}
                                        </code>
                                        <button
                                            onClick={handleCopy}
                                            className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                            title="Copy ID"
                                        >
                                            {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4 text-slate-500" />}
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={generateUuid}
                                        className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
                                    >
                                        Generate Identity
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5">
                            <div className="flex gap-3">
                                <ShieldAlert className="h-5 w-5 text-amber-500 flex-shrink-0" />
                                <div>
                                    <h4 className="text-xs font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest">Administrator Note</h4>
                                    <p className="mt-1 text-sm text-amber-700 dark:text-amber-400 opacity-90 leading-relaxed font-medium">
                                        Your role is determined by your unique UUID. Do not share your ID or account credentials with anyone.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};
