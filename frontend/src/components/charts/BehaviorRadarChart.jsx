import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

const BehaviorRadarChart = ({ data }) => {
    return (
        <div className="bg-dark-800 border border-dark-border rounded-sm p-6 h-full relative group hover:border-dark-600 transition-colors">
            <h3 className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-4">Cognitive Traits</h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                        <PolarGrid stroke="#22252b" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar
                            name="Traits"
                            dataKey="A"
                            stroke="#3274d9"
                            strokeWidth={2}
                            fill="#3274d9"
                            fillOpacity={0.3}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#111217', borderColor: '#181b1f', borderRadius: '4px' }}
                            itemStyle={{ color: '#fff' }}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default BehaviorRadarChart;
