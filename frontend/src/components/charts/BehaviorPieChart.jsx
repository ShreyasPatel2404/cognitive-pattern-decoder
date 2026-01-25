import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-dark-800 border border-dark-700 p-2 rounded shadow-lg">
                <p className="text-gray-300 text-xs mb-1">{payload[0].name}</p>
                <p className="text-white text-sm font-bold font-mono">
                    {payload[0].value}%
                </p>
            </div>
        );
    }
    return null;
};

const COLORS = ['#3274d9', '#299c46', '#e0bf00', '#f2495c'];

const BehaviorPieChart = ({ data }) => {
    return (
        <div className="bg-dark-800 border border-dark-border rounded-sm p-6 h-full relative group hover:border-dark-600 transition-colors">
            <h3 className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-4">Behavior Distribution</h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            iconType="circle"
                            iconSize={8}
                            formatter={(value) => <span className="text-gray-400 text-xs ml-1">{value}</span>}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default BehaviorPieChart;
