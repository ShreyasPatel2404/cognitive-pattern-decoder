import React, { useState, useEffect } from 'react';
import { sessionService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, Activity, FileText } from 'lucide-react';
import clsx from 'clsx';

const History = () => {
    const { user } = useAuth();
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedSession, setSelectedSession] = useState(null);

    useEffect(() => {
        const fetchSessions = async () => {
            if (!user) return;
            try {
                const data = await sessionService.getSessionsByUser();
                // Sort by newest first
                setSessions(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
            } catch (err) {
                setError("Failed to load history");
            } finally {
                setLoading(false);
            }
        };

        fetchSessions();
    }, [user]);

    if (loading) return <div className="text-center p-8 text-gray-400">Loading History...</div>;
    if (error) return <div className="text-center p-8 text-danger">{error}</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-100 tracking-tight">Session History</h1>

            {/* DETAIL VIEW (THE 'IMAGE TYPE' DATA) */}
            {selectedSession && (
                <div className="bg-dark-800 border-l-[4px] border-l-primary-500 border border-dark-border p-6 rounded-sm mb-6 animate-in fade-in slide-in-from-top-2">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-gray-100 flex items-center gap-2">
                            <Activity className="text-primary-500" />
                            Session Analysis
                        </h3>
                        <button onClick={() => setSelectedSession(null)} className="text-gray-400 hover:text-white">Close</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h4 className="text-sm uppercase tracking-wider text-gray-500 font-bold mb-4">Cognitive Pattern Map</h4>
                            {/* Placeholder for the 'Image' - using a CSS visual representation */}
                            <div className="aspect-video bg-dark-900 rounded border border-dark-border flex items-center justify-center relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 to-transparent"></div>
                                <div className="relative z-10 text-center">
                                    <div className="text-4xl font-black text-primary-500/50 mb-2">
                                        {(selectedSession.typingSpeed > 30) ? 'FLOW STATE' : 'DEEP THINKING'}
                                    </div>
                                    <p className="text-gray-400 text-xs">Visual Representation of Session #{selectedSession._id.slice(-4)}</p>
                                </div>
                                {/* Abstract Visual Elements */}
                                <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
                                    <svg width="100%" height="100%">
                                        <circle cx="50%" cy="50%" r={selectedSession.typingSpeed || 20} fill="currentColor" className="text-primary-500 animate-pulse" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between border-b border-dark-border pb-2">
                                <span className="text-gray-400">Typing Speed</span>
                                <span className="text-gray-200 font-mono">{selectedSession.typingSpeed || 0} WPM</span>
                            </div>
                            <div className="flex justify-between border-b border-dark-border pb-2">
                                <span className="text-gray-400">Duration</span>
                                <span className="text-gray-200 font-mono">{Math.floor((selectedSession.sessionTime || 0) / 60)}m</span>
                            </div>
                            <div className="flex justify-between border-b border-dark-border pb-2">
                                <span className="text-gray-400">Backspaces</span>
                                <span className="text-gray-200 font-mono">{selectedSession.backspaceCount || 0}</span>
                            </div>
                            <div className="flex justify-between border-b border-dark-border pb-2">
                                <span className="text-gray-400">Cognitive Load (Pause)</span>
                                <span className="text-gray-200 font-mono">{selectedSession.avgPauseTime || 0}s</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-dark-800 border border-dark-border rounded-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-dark-700 text-gray-200 uppercase font-medium">
                            <tr>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Project</th>
                                <th className="px-6 py-4 text-center">Duration</th>
                                <th className="px-6 py-4 text-center">WPM</th>
                                <th className="px-6 py-4 text-center">Switches</th>
                                <th className="px-6 py-4 text-center">Backspaces</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-border">
                            {sessions.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                        No sessions recorded yet.
                                    </td>
                                </tr>
                            ) : (
                                sessions.map((session) => (
                                    <tr
                                        key={session._id}
                                        onClick={() => setSelectedSession(session)}
                                        className={clsx(
                                            "transition-colors cursor-pointer",
                                            selectedSession?._id === session._id ? "bg-primary-900/20 border-l-2 border-primary-500" : "hover:bg-dark-700/50"
                                        )}
                                    >
                                        <td className="px-6 py-4 font-medium text-gray-300">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} className="text-primary-500" />
                                                {new Date(session.createdAt).toLocaleDateString()}
                                                <span className="text-xs text-gray-500 ml-1">
                                                    {new Date(session.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-300">
                                            <div className="flex items-center gap-2">
                                                <FileText size={14} className="text-gray-500" />
                                                {session.projectId || 'Unknown Project'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center font-mono">
                                            {session.sessionTime ? `${Math.floor(session.sessionTime / 60)}m` : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={clsx(
                                                "px-2 py-1 rounded text-xs font-bold",
                                                session.typingSpeed > 60 ? "bg-success/10 text-success" : "bg-dark-600 text-gray-300"
                                            )}>
                                                {session.typingSpeed || 0}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center font-mono">{session.fileSwitchCount || 0}</td>
                                        <td className="px-6 py-4 text-center font-mono text-danger/80">{session.backspaceCount || 0}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default History;
