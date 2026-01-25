import React from 'react';
import clsx from 'clsx';
import { Brain } from 'lucide-react';

const PredictionPanel = ({ cognitiveStyle, confidence, isLoading }) => {
    const percentage = Math.round((confidence || 0) * 100);

    // Color coding based on confidence
    let colorClass = "bg-primary-500";
    if (percentage > 80) colorClass = "bg-success";
    else if (percentage < 50) colorClass = "bg-warning";

    return (
        <div className="bg-dark-800 border border-dark-border rounded-sm p-6 relative overflow-hidden h-full flex flex-col justify-center relative group hover:border-dark-600 transition-colors">

            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary-500/10 rounded-full">
                    <Brain className="text-primary-500" size={24} />
                </div>
                <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">Cognitive Style Prediction</h3>
            </div>

            <div className="flex-1 flex flex-col justify-center">
                {isLoading ? (
                    <div className="animate-pulse space-y-3">
                        <div className="h-8 bg-dark-700 rounded w-3/4"></div>
                        <div className="h-2 bg-dark-700 rounded w-full"></div>
                    </div>
                ) : (
                    <>
                        <h2 className="text-4xl font-bold text-gray-100 mb-2 tracking-tight">
                            {cognitiveStyle || "Analyzing..."}
                        </h2>

                        <div className="mt-4">
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-gray-400">Confidence Score</span>
                                <span className="text-gray-100 font-mono">{percentage}%</span>
                            </div>
                            <div className="w-full bg-dark-700 rounded-full h-2 overflow-hidden">
                                <div
                                    className={clsx("h-2 rounded-full transition-all duration-1000", colorClass)}
                                    style={{ width: `${percentage}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="mt-4 text-xs text-gray-500">
                            Based on real-time typing patterns and code navigation behavior.
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default PredictionPanel;
