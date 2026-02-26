import React from 'react';

interface EmptyStateProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    icon,
    title,
    description,
    action,
}) => {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-full p-4 mb-4 [&>svg]:w-8 [&>svg]:h-8 [&>svg]:text-slate-400 dark:[&>svg]:text-slate-300">
                {icon}
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">{title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">{description}</p>
            {action && <div>{action}</div>}
        </div>
    );
};
