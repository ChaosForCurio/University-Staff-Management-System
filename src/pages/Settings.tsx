import React from 'react';
import { Settings as SettingsIcon, Moon, Sun, Monitor } from 'lucide-react';
import { EmptyState } from '../components/EmptyState';
import { useTheme } from '../context/ThemeContext';

export const Settings: React.FC = () => {
    const { theme, setTheme } = useTheme();
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
            </div>

            <div className="bg-white dark:bg-slate-900/50 dark:backdrop-blur-xl rounded-xl shadow-sm border border-slate-200 dark:border-slate-800/60 overflow-hidden">
                <div className="p-6 border-b border-slate-200 dark:border-slate-800/60">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Appearance</h2>
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

                <div className="p-6">
                    <EmptyState
                        icon={<SettingsIcon />}
                        title="More Settings Coming Soon"
                        description="Additional system settings and application configurations will be available here in a future update."
                    />
                </div>
            </div >
        </div >
    );
};
