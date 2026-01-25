import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-dark-800 border border-dark-700 p-2 rounded shadow-lg">
                <p className="text-gray-300 text-xs mb-1">{label}</p>
                <p className="text-white text-sm font-bold font-mono">
                    {payload[0].value} Events
                </p>
            </div>
        );
    }
    return null;
};

const ActivityBarChart = ({ data }) => {
    return (
        <div className="bg-dark-800 border border-dark-border rounded-sm p-6 h-full relative group hover:border-dark-600 transition-colors">
            <h3 className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-4">Session Activity</h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#22252b" horizontal={false} />
                        <XAxis type="number" hide />
                        <YAxis
                            dataKey="name"
                            type="category"
                            width={100}
                            tick={{ fill: '#9ca3af', fontSize: 11 }}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#22252b' }} />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color || '#3274d9'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ActivityBarChart;
