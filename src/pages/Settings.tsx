import React, { useState } from 'react';
import { Settings as SettingsIcon, Moon, Sun, Monitor, Shield, Fingerprint, Copy, Check } from 'lucide-react';
import { EmptyState } from '../components/EmptyState';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export const Settings: React.FC = () => {
    const { theme, setTheme } = useTheme();
    const { userUuid, generateUuid } = useAuth();
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (userUuid) {
            navigator.clipboard.writeText(userUuid);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {/* Appearance Section */}
                <div className="bg-white dark:bg-slate-900/50 dark:backdrop-blur-xl rounded-xl shadow-sm border border-slate-200 dark:border-slate-800/60 overflow-hidden">
                    <div className="p-6">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            <Monitor className="h-5 w-5 text-indigo-500" />
                            Appearance
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                            Customize the look and feel of your application.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
                            <button
                                onClick={() => setTheme('light')}
                                className={`flex flex-col items-center justify-center p-6 border-2 rounded-xl transition-all ${theme === 'light'
                                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 dark:border-indigo-500/50'
                                    : 'border-slate-200 dark:border-slate-700/50 hover:border-indigo-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-400'
                                    }`}
                            >
                                <Sun className="h-8 w-8 mb-3" />
                                <span className="font-medium">Light</span>
                            </button>

                            <button
                                onClick={() => setTheme('dark')}
                                className={`flex flex-col items-center justify-center p-6 border-2 rounded-xl transition-all ${theme === 'dark'
                                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 dark:border-indigo-500/50'
                                    : 'border-slate-200 dark:border-slate-700/50 hover:border-indigo-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-400'
                                    }`}
                            >
                                <Moon className="h-8 w-8 mb-3" />
                                <span className="font-medium">Dark</span>
                            </button>

                            <button
                                onClick={() => setTheme('system')}
                                className={`flex flex-col items-center justify-center p-6 border-2 rounded-xl transition-all ${theme === 'system'
                                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 dark:border-indigo-500/50'
                                    : 'border-slate-200 dark:border-slate-700/50 hover:border-indigo-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-400'
                                    }`}
                            >
                                <Monitor className="h-8 w-8 mb-3" />
                                <span className="font-medium">System</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Security & Identity Section */}
                <div className="bg-white dark:bg-slate-900/50 dark:backdrop-blur-xl rounded-xl shadow-sm border border-slate-200 dark:border-slate-800/60 overflow-hidden">
                    <div className="p-6">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            <Shield className="h-5 w-5 text-indigo-500" />
                            Security & Identity
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                            Manage your unique system identity and security credentials.
                        </p>

                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 mb-6 border border-slate-200 dark:border-slate-700">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-100 dark:bg-indigo-500/10 rounded-lg">
                                        <Fingerprint className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Unique Session Identifier</p>
                                        <p className="text-sm font-mono font-medium text-slate-900 dark:text-white break-all">
                                            {userUuid || 'Not Generated'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {userUuid && (
                                        <button
                                            onClick={handleCopy}
                                            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                        >
                                            {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                                            {copied ? 'Copied' : 'Copy ID'}
                                        </button>
                                    )}
                                    <button
                                        onClick={generateUuid}
                                        className="flex items-center gap-2 px-4 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors shadow-sm shadow-indigo-200 dark:shadow-none"
                                    >
                                        {userUuid ? 'Regenerate ID' : 'Generate ID'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900/50 dark:backdrop-blur-xl rounded-xl shadow-sm border border-slate-200 dark:border-slate-800/60 p-6">
                    <EmptyState
                        icon={<SettingsIcon />}
                        title="Advanced Settings Coming Soon"
                        description="Notification preferences, data export, and integration settings will be available in the next version."
                    />
                </div>
            </div>
        </div>
    );
};
