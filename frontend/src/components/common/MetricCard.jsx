import React from 'react';
import clsx from 'clsx';

const MetricCard = ({ label, value, subValue, icon: Icon, className, trend }) => {
    return (
        <div className={clsx(
            "bg-dark-800 border-l-[3px] border-l-primary-500 border-y border-r border-dark-border rounded-sm p-6 relative overflow-hidden transition-all hover:border-dark-600",
            className
        )}>
            <div className="flex justify-between items-start mb-2">
                <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">{label}</span>
                {Icon && <Icon size={16} className="text-primary-500 opacity-80" />}
            </div>

            <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-mono font-bold text-gray-100">{value}</h3>
                {subValue && (
                    <span className="text-xs text-gray-500 font-mono">{subValue}</span>
                )}
            </div>

            {trend && (
                <div className={clsx("text-xs mt-1",
                    trend > 0 ? "text-success" : "text-danger"
                )}>
                    {trend > 0 ? "+" : ""}{trend}%
                </div>
            )}
        </div>
    );
};

export default MetricCard;
