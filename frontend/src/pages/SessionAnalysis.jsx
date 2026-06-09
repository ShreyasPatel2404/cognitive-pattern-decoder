import React, { useState, useEffect, useCallback } from 'react';
import BehaviorRadarChart from '../components/charts/BehaviorRadarChart';
import MetricCard from '../components/common/MetricCard';
import { Brain } from 'lucide-react';
import { sessionService, mlService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const SessionAnalysis = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [radarData, setRadarData] = useState([]);
    const [analysis, setAnalysis] = useState({
        cognitiveStyle: "Analyzing...",
        consistency: 0,
        logicSpeed: 0,
        focusScore: 0,
        pauseDuration: 0,
        latency: 0,
        errorFreq: 0
    });

    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        if (!user) return;

        setLoading(true);
        try {
            const userId = user.id;

            // 2. Fetch Sessions for Radar Data (Latest Session)
            const sessions = await sessionService.getSessionsByUser(userId);

            if (sessions && sessions.length > 0) {
                const latestSession = sessions[sessions.length - 1]; // Last one

                // Transform for Radar Chart
                // We need to normalize these values to 0-100 scale for the chart
                // Assuming max speed ~100 wpm, accuracy 100%, etc.
                const speedScore = Math.min(100, (latestSession.typingSpeed || 0));
                const focusScore = Math.max(0, 100 - ((latestSession.fileSwitchCount || 0) * 5)); // Penalty for switches
                const accuracyScore = 100; // Simplified
                const logicScore = 85; // Mock/ML derived ideally
                const memoryScore = 70; // Mock/ML derived
                const consistencyScore = 100 - ((latestSession.backspaceCount || 0));

                setRadarData([
                    { subject: 'Focus', A: focusScore, fullMark: 100 },
                    { subject: 'Speed', A: speedScore, fullMark: 100 },
                    { subject: 'Accuracy', A: accuracyScore, fullMark: 100 },
                    { subject: 'Consistency', A: consistencyScore, fullMark: 100 },
                    { subject: 'Memory', A: memoryScore, fullMark: 100 },
                    { subject: 'Logic', A: logicScore, fullMark: 100 },
                ]);

                setAnalysis({
                    cognitiveStyle: "Analytical", // ideally from ML endpoint
                    consistency: consistencyScore,
                    logicSpeed: 85, // percentile
                    focusScore: (focusScore / 10).toFixed(1),
                    pauseDuration: latestSession.avgPauseTime || 0,
                    latency: 45, // ms (mock)
                    errorFreq: (latestSession.backspaceCount / (latestSession.sessionTime || 1)).toFixed(2) // per sec/min
                });

                // Try fetching ML prediction if available
                try {
                    const mlResults = await mlService.getResultsByUser(userId);
                    if (mlResults.length > 0) {
                        const lastMl = mlResults[mlResults.length - 1];
                        setAnalysis(prev => ({
                            ...prev,
                            cognitiveStyle: lastMl.cognitiveStyle || prev.cognitiveStyle
                        }));
                    }
                } catch (e) { }

            } else {
                setRadarData([
                    { subject: 'Focus', A: 0, fullMark: 100 },
                    { subject: 'Speed', A: 0, fullMark: 100 },
                    { subject: 'Accuracy', A: 0, fullMark: 100 },
                    { subject: 'Consistency', A: 0, fullMark: 100 },
                    { subject: 'Memory', A: 0, fullMark: 100 },
                    { subject: 'Logic', A: 0, fullMark: 100 },
                ]);
            }

        } catch (err) {
            console.error(err);
            setError("Failed to load analysis data.");
        } finally {
            setLoading(false);
        }
}, [user]);

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user, fetchData]);

    if (loading) return <div className="p-8 text-center text-gray-400">Loading Analysis...</div>;
    if (error) return <div className="p-8 text-center text-danger">{error}</div>;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-100 tracking-tight">Session Analysis</h1>
                <p className="text-gray-400 mt-1">Deep dive into your coding behavior</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Radar Chart Panel */}
                <div className="lg:col-span-1 h-80">
                    <BehaviorRadarChart data={radarData} />
                </div>

                {/* Explanation Panel */}
                <div className="lg:col-span-2 bg-dark-800 border border-dark-border rounded-sm p-6">
                    <h3 className="text-gray-100 font-bold mb-4 flex items-center gap-2">
                        <Brain size={20} className="text-primary-500" />
                        Cognitive Profile Analysis
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-4">
                        Your current session demonstrates a strong <span className="text-primary-500 font-bold">{analysis.cognitiveStyle}</span> pattern.
                        High typing speed combined with low backspace usage indicates clear thought formulation before execution.
                    </p>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        Compared to previous sessions, your <strong>Consistency</strong> score is {analysis.consistency}%, suggesting steady focus.
                        Logic processing speed is in the top 5 percentile.
                    </p>

                    <div className="mt-8 grid grid-cols-2 gap-4">
                        <div className="p-3 bg-dark-700/30 rounded border border-dark-border">
                            <span className="text-xs text-gray-500 uppercase block mb-1">Dominant Trait</span>
                            <span className="text-gray-200 font-mono font-bold">Logical Flow</span>
                        </div>
                        <div className="p-3 bg-dark-700/30 rounded border border-dark-border">
                            <span className="text-xs text-gray-500 uppercase block mb-1">Area for Improv.</span>
                            <span className="text-gray-200 font-mono font-bold">Paste Efficiency</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Detailed Metrics Grid */}
            <h3 className="text-lg font-bold text-gray-200 mt-4">Detailed Metrics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-dark-800 p-6 border border-dark-border rounded-sm">
                    <div className="text-gray-500 text-xs uppercase mb-1">Avg Pause Duration</div>
                    <div className="text-xl font-mono text-gray-100">{analysis.pauseDuration}s</div>
                </div>
                <div className="bg-dark-800 p-6 border border-dark-border rounded-sm">
                    <div className="text-gray-500 text-xs uppercase mb-1">Keypress Latency</div>
                    <div className="text-xl font-mono text-gray-100">{analysis.latency}ms</div>
                </div>
                <div className="bg-dark-800 p-6 border border-dark-border rounded-sm">
                    <div className="text-gray-500 text-xs uppercase mb-1">Error Frequency</div>
                    <div className="text-xl font-mono text-gray-100">{analysis.errorFreq}/min</div>
                </div>
                <div className="bg-dark-800 p-6 border border-dark-border rounded-sm">
                    <div className="text-gray-500 text-xs uppercase mb-1">Focus Score</div>
                    <div className="text-xl font-mono text-success">{analysis.focusScore}/10</div>
                </div>
            </div>
        </div>
    );
};

export default SessionAnalysis;
