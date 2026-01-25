import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-dark-800 border border-dark-700 p-2 rounded shadow-lg">
                <p className="text-gray-300 text-xs mb-1">{label}</p>
                <p className="text-primary-500 text-sm font-bold font-mono">
                    {payload[0].value} WPM
                </p>
            </div>
        );
    }
    return null;
};

const TypingSpeedChart = ({ data }) => {
    return (
        <div className="bg-dark-800 border border-dark-border rounded-sm p-6 h-full relative group hover:border-dark-600 transition-colors">
            <h3 className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-4">Typing Speed Trend</h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#22252b" vertical={false} />
                        <XAxis
                            dataKey="time"
                            stroke="#4b5563"
                            tick={{ fill: '#9ca3af', fontSize: 10 }}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#4b5563"
                            tick={{ fill: '#9ca3af', fontSize: 10 }}
                            tickLine={false}
                            axisLine={false}
                            width={30}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                            type="monotone"
                            dataKey="speed"
                            stroke="#3274d9"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 4, fill: '#3274d9', stroke: '#111217', strokeWidth: 2 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default TypingSpeedChart;
