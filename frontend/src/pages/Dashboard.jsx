import React, { useState, useEffect } from 'react';
import {
    Type,
    Target,
    Clipboard,
    Clock,
    Delete,
    Hammer,
    FileCode,
    Save,
    RotateCcw,
    PieChart as PieChartIcon,
    ArrowRight
} from 'lucide-react';
import MetricCard from '../components/common/MetricCard';
import PredictionPanel from '../components/dashboard/PredictionPanel';
import TypingSpeedChart from '../components/charts/TypingSpeedChart';
import ActivityBarChart from '../components/charts/ActivityBarChart';
import BehaviorPieChart from '../components/charts/BehaviorPieChart';
import UserSearchBar from '../components/UserSearchBar';
import { sessionService, mlService, userService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// CONSTANTS FOR PIE CHART
const PIE_COLORS = ['#3274d9', '#e0bf00', '#f2495c', '#299c46', '#9333ea', '#00bcd4'];

const Dashboard = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [metrics, setMetrics] = useState({
        typingSpeed: 0,
        accuracyRate: 0,
        pasteRatio: 0,
        sessionDuration: 0,
        backspaceCount: 0,
        compileAttempts: 0,
        fileSwitchCount: 0,
        saveCount: 0,
        totalSessions: 0
    });

    // Prediction State
    const [prediction, setPrediction] = useState({
        cognitive_style: "Analyzing...",
        confidence: 0
    });

    // Charts State
    const [chartsData, setChartsData] = useState({
        speedTrend: [],
        activityData: [],
        behaviorData: []
    });

    // COMPARISON STATE
    const [comparisonUser, setComparisonUser] = useState(null);
    const [comparisonData, setComparisonData] = useState(null);
    const [loadingComparison, setLoadingComparison] = useState(false);
    const [comparisonError, setComparisonError] = useState(null);

    // DEMO DATA GENERATOR
    useEffect(() => {
        if (!user) {
            // Mode 1: Public Demo
            setMetrics({
                typingSpeed: 55,
                accuracyRate: 88,
                pasteRatio: 10,
                sessionDuration: 800,
                backspaceCount: 12,
                compileAttempts: 2,
                fileSwitchCount: 3,
                saveCount: 4
            });
            setPrediction({
                cognitive_style: "Demo Style",
                confidence: 0.95
            });

            // Mock Charts
            setChartsData({
                speedTrend: [
                    { time: '10:00', speed: 40 },
                    { time: '10:05', speed: 45 },
                    { time: '10:10', speed: 55 },
                    { time: '10:15', speed: 52 },
                    { time: '10:20', speed: 60 },
                    { time: '10:25', speed: 58 },
                ],
                activityData: [
                    { name: 'Typing', value: 500, color: '#3274d9' },
                    { name: 'Thinking', value: 200, color: '#e0bf00' },
                    { name: 'Debugging', value: 100, color: '#f2495c' },
                ],
                behaviorData: [
                    { name: 'Coding', value: 65 },
                    { name: 'Reviewing', value: 25 },
                    { name: 'Idle', value: 10 },
                ]
            });
        }
    }, [user]);

    // REAL DATA FETCHER
    const fetchData = async () => {
        if (!user) return;

        setLoading(true);
        setError(null);
        try {
            // Fetch Sessions (User ID from Token automatically)
            const sessions = await sessionService.getSessionsByUser();

            if (sessions && sessions.length > 0) {
                const totalSessions = sessions.length;
                const grandTotalChars = sessions.reduce((acc, s) => acc + (s.typedChars || 0), 0);
                const grandTotalPasteChars = sessions.reduce((acc, s) => acc + (s.pasteCharacters || 0), 0);

                // Calculate Global WPM
                const totalDurationSeconds = sessions.reduce((acc, s) => acc + (s.sessionTime || 0), 0);
                const totalMinutes = totalDurationSeconds / 60;
                // Avoid division by zero
                const avgSpeed = totalMinutes > 0
                    ? Math.round((grandTotalChars / 5) / totalMinutes)
                    : 0;
                const totalBackspaces = sessions.reduce((acc, s) => acc + (s.backspaceCount || 0), 0);
                const totalSaves = sessions.reduce((acc, s) => acc + (s.saveCount || 0), 0);
                const totalFileSwitches = sessions.reduce((acc, s) => acc + (s.fileSwitchCount || 0), 0);
                const avgDuration = Math.round(sessions.reduce((acc, s) => acc + (s.sessionTime || 0), 0) / totalSessions);
                const avgPause = Math.round(sessions.reduce((acc, s) => acc + (s.avgPauseTime || 0), 0) / totalSessions);

                const accuracy = grandTotalChars > 0
                    ? Math.max(0, Math.round(100 - ((totalBackspaces / grandTotalChars) * 100)))
                    : 100;

                const pasteRatio = grandTotalChars > 0
                    ? Math.round((grandTotalPasteChars / grandTotalChars) * 100)
                    : 0;

                setMetrics({
                    typingSpeed: avgSpeed,
                    accuracyRate: accuracy,
                    pasteRatio: pasteRatio,
                    sessionDuration: avgDuration,
                    backspaceCount: totalBackspaces,
                    avgPauseTime: avgPause,
                    fileSwitchCount: totalFileSwitches,
                    saveCount: totalSaves,
                    totalSessions: totalSessions
                });

                // Update Charts Data
                const recentSessions = sessions.slice(-10);
                const speedTrendData = recentSessions.map(s => ({
                    time: new Date(s.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    speed: s.typingSpeed || 0
                }));

                const activityDataTransformed = [
                    { name: 'Typing', value: grandTotalChars, color: '#3274d9' },
                    { name: 'Deletions', value: totalBackspaces, color: '#f2495c' },
                    { name: 'Reviewing', value: Math.round(avgDuration * 0.2), color: '#e0bf00' },
                    { name: 'Idle', value: Math.round(avgDuration * 0.1), color: '#299c46' },
                ];

                const behaviorDataTransformed = [
                    { name: 'Coding', value: 70 },
                    { name: 'Debugging', value: 20 },
                    { name: 'Planning', value: 10 },
                ];

                setChartsData({
                    speedTrend: speedTrendData,
                    activityData: activityDataTransformed,
                    behaviorData: behaviorDataTransformed
                });

                // Prediction
                try {
                    const results = await mlService.getResultsByUser(user.id);
                    if (results && results.length > 0) {
                        const latest = results[results.length - 1];
                        setPrediction({
                            cognitive_style: latest.cognitiveStyle || "Analytical",
                            confidence: latest.confidence || 0.85
                        });
                    }
                } catch (mlErr) {
                    console.warn("ML Results fetch error", mlErr);
                }

            }

        } catch (err) {
            console.error("Dashboard Error:", err);
            setError("Failed to connect to backend.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user]);

    // HANDLE USER SELECTION FOR COMPARISON
    const handleUserSelect = async (selected) => {
        setComparisonUser(selected);
        if (!selected) {
            setComparisonData(null);
            return;
        }

        setLoadingComparison(true);
        setComparisonError(null);
        try {
            const data = await userService.getComparison(selected._id);
            setComparisonData(data);
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data && err.response.data.error) {
                setComparisonError(err.response.data.error);
            } else {
                setComparisonError("Failed to load comparison data.");
            }
        } finally {
            setLoadingComparison(false);
        }
    };

    // SETUP PIE CHART DATA (Transform Metrics to Pie Data)
    const getPieData = (metricsData) => {
        if (!metricsData) return [];
        return [
            { name: 'Typing Speed', value: metricsData.typingSpeed || 0 },
            { name: 'Accuracy', value: metricsData.accuracyRate || 0 },
            { name: 'Paste Ratio', value: metricsData.pasteRatio || 0 },
            { name: 'Backspaces (Normalized)', value: Math.min(100, metricsData.backspaceCount || 0) }, // Cap for visual
            { name: 'Duration (Min)', value: Math.round((metricsData.sessionDuration || 0) / 60) },
        ];
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        return `${mins}m`;
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-400">Loading Dashboard Data...</div>;
    }

    if (error) {
        return (
            <div className="p-8 text-center">
                <p className="text-danger mb-4">{error}</p>
                <button
                    onClick={fetchData}
                    className="px-4 py-2 bg-dark-800 border border-dark-border rounded text-gray-300 hover:bg-dark-700"
                >
                    Retry Connection
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {!user && (
                <div className="bg-primary-900/30 border border-primary-500/30 p-4 rounded-sm flex items-center justify-between">
                    <div>
                        <h3 className="text-primary-400 font-bold">Public Demo Mode</h3>
                        <p className="text-gray-400 text-sm">You are viewing sample data. Log in to track your real cognitive metrics.</p>
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-100 tracking-tight">Dashboard</h1>
                    <p className="text-gray-400 mt-1">Real-time cognitive pattern analysis</p>
                </div>

                {user && (
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <UserSearchBar onSelectUser={handleUserSelect} selectedUser={comparisonUser} />
                        <button
                            onClick={fetchData}
                            className="flex items-center gap-2 px-3 py-2 bg-dark-800 hover:bg-dark-700 text-gray-300 rounded border border-dark-border transition-colors text-sm"
                        >
                            <RotateCcw size={14} /> Refresh
                        </button>
                    </div>
                )}
            </div>

            {/* COMPARISON SECTION */}
            {comparisonUser && (
                <div className="bg-dark-800 border border-dark-border rounded-sm p-6 mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-100 flex items-center gap-2">
                            <PieChartIcon className="text-primary-500" />
                            User Comparison Analysis
                        </h3>
                    </div>

                    {loadingComparison ? (
                        <div className="text-center py-12 text-gray-400">Loading Comparison...</div>
                    ) : comparisonError ? (
                        <div className="text-center py-12 text-danger">{comparisonError}</div>
                    ) : comparisonData ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Current User */}
                            <div className="relative">
                                <h4 className="text-center text-gray-300 font-medium mb-4">You</h4>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={getPieData(comparisonData.currentUser)}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {getPieData(comparisonData.currentUser).map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }}
                                                itemStyle={{ color: '#f3f4f6' }}
                                            />
                                            <Legend verticalAlign="bottom" height={36} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                                    <div className="text-2xl font-bold text-gray-100">{comparisonData.currentUser.typingSpeed}</div>
                                    <div className="text-xs text-gray-500">Avg WPM</div>
                                </div>
                            </div>

                            {/* Compared User */}
                            <div className="relative">
                                <h4 className="text-center text-gray-300 font-medium mb-4">{comparisonUser.name}</h4>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={getPieData(comparisonData.comparedUser)}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {getPieData(comparisonData.comparedUser).map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }}
                                                itemStyle={{ color: '#f3f4f6' }}
                                            />
                                            <Legend verticalAlign="bottom" height={36} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                                    <div className="text-2xl font-bold text-gray-100">{comparisonData.comparedUser.typingSpeed}</div>
                                    <div className="text-xs text-gray-500">Avg WPM</div>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            )}

            {/* Top Row Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    label="Typing Speed"
                    value={`${metrics.typingSpeed} WPM`}
                    icon={Type}
                />
                <MetricCard
                    label="Accuracy Rate"
                    value={`${metrics.accuracyRate}%`}
                    icon={Target}
                />
                <MetricCard
                    label="Paste Ratio"
                    value={`${metrics.pasteRatio}%`}
                    icon={Clipboard}
                    subValue={`${metrics.pasteRatio > 20 ? 'High' : 'Normal'}`}
                />
                <MetricCard
                    label="Session Duration"
                    value={formatTime(metrics.sessionDuration)}
                    icon={Clock}
                />
            </div>

            {/* Second Row Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <MetricCard
                    label="Backspaces"
                    value={metrics.backspaceCount}
                    icon={Delete}
                />
                <MetricCard
                    label="Thinking Time (Avg)"
                    value={`${metrics.avgPauseTime || 0}s`}
                    icon={Clock}
                    subValue="Avg Pause"
                />
                <MetricCard
                    label="File Switches"
                    value={metrics.fileSwitchCount}
                    icon={FileCode}
                />
                <MetricCard
                    label="Saves"
                    value={metrics.saveCount}
                    icon={Save}
                />
                <MetricCard
                    label="Total Sessions"
                    value={metrics.totalSessions || 0}
                    icon={Clipboard}
                />
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[400px]">
                {/* Charts Section */}
                <div className="lg:col-span-2 space-y-6 flex flex-col h-full">
                    <div className="flex-1 h-1/2">
                        <TypingSpeedChart data={chartsData.speedTrend} />
                    </div>
                    <div className="flex-1 h-1/2 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ActivityBarChart data={chartsData.activityData} />
                        <BehaviorPieChart data={chartsData.behaviorData} />
                    </div>
                </div>

                {/* Prediction Panel */}
                <div className="lg:col-span-1 h-full flex flex-col gap-4">
                    <PredictionPanel
                        cognitiveStyle={prediction.cognitive_style}
                        confidence={prediction.confidence}
                        isLoading={loading}
                    />

                    {/* Visualization Image */}
                    {prediction.visualization && (
                        <div className="bg-dark-800 border border-dark-border rounded-sm p-4 animate-in fade-in zoom-in duration-300">
                            <h4 className="text-gray-400 text-sm font-medium mb-3">Pattern Visualization</h4>
                            <img
                                src={`data:image/png;base64,${prediction.visualization}`}
                                alt="Cognitive Pattern Visualization"
                                className="w-full rounded-lg border border-[#2F2F2F] shadow-lg"
                            />
                        </div>
                    )}

                    {/* Manual trigger for demo/testing if needed */}
                    {user && (
                        <div className="mt-auto">
                            <button
                                onClick={async () => {
                                    setLoading(true);
                                    try {
                                        // Use current metrics for prediction
                                        const result = await import('../services/api').then(m => m.predictSession(metrics));
                                        setPrediction({
                                            cognitive_style: result.cognitive_style,
                                            confidence: result.confidence,
                                            visualization: result.visualization
                                        });
                                    } catch (err) {
                                        console.error(err);
                                        setError("Prediction failed");
                                    } finally {
                                        setLoading(false);
                                    }
                                }}
                                className="w-full py-2 bg-primary-600 hover:bg-primary-700 text-white rounded transition-colors text-sm font-medium"
                                disabled={loading}
                            >
                                {loading ? 'Analyzing...' : 'Run Live Analysis'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
