import React, { useState, useEffect, useCallback } from 'react';
import { sessionService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Calendar, Activity, FileText, Trash2 } from 'lucide-react';
import clsx from 'clsx';

const History = () => {
    const { user } = useAuth();
    const [sessions, setSessions] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [selectedSession, setSelectedSession] = useState(null);

    const LIMIT = 10;

    const fetchSessions = useCallback(async (pageNumber) => {
        setLoading(true);
        setError(null);

        try {
            const data = await sessionService.getSessionsByPage(pageNumber, LIMIT);
            setSessions(data.sessions || []);
            setTotalPages(data.pages || 1);
        } catch (err) {
            console.error('Failed to load history', err);
            setError('Failed to load history. Please refresh and try again.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!user) return;
        fetchSessions(page);
    }, [user, page, fetchSessions]);

    const handleDelete = async (sessionId) => {
        const confirmed = window.confirm('Delete this session? This cannot be undone.');
        if (!confirmed) return;

        setDeletingId(sessionId);

        try {
            await sessionService.deleteSession(sessionId);
            setSessions((prev) => prev.filter((session) => session._id !== sessionId));
            if (selectedSession?._id === sessionId) {
                setSelectedSession(null);
            }
        } catch (err) {
            console.error('Failed to delete session', err);
            window.alert('Failed to delete session. Please try again.');
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                <div
                    style={{
                        width: 36,
                        height: 36,
                        border: '3px solid #e5e7eb',
                        borderTop: '3px solid #3b82f6',
                        borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite'
                    }}
                />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-8 text-gray-400">
                {error}
            </div>
        );
    }

    if (sessions.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>📊</div>
                <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 8, color: '#111827' }}>
                    No sessions yet
                </h2>
                <p style={{ color: '#6b7280', fontSize: 15 }}>
                    Install the VS Code extension, type some code, and your sessions will appear here.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-100 tracking-tight">Session History</h1>
                    <p className="text-sm text-gray-400 mt-1">Review your past sessions, delete old entries, and inspect any result.</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-400">Page {page} of {totalPages}</span>
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="rounded bg-dark-700 px-4 py-2 text-sm font-medium text-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        ← Prev
                    </button>
                    <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="rounded bg-dark-700 px-4 py-2 text-sm font-medium text-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Next →
                    </button>
                </div>
            </div>

            {selectedSession && (
                <div className="bg-dark-800 border-l-4 border-l-primary-500 border border-dark-border p-6 rounded-sm mb-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
                        <div>
                            <h3 className="text-xl font-bold text-gray-100 flex items-center gap-2">
                                <Activity className="text-primary-500" />
                                Session Analysis
                            </h3>
                            <p className="text-sm text-gray-400 mt-1">Selected session details and quick metrics.</p>
                        </div>
                        <button
                            onClick={() => setSelectedSession(null)}
                            className="rounded bg-dark-700 px-3 py-2 text-sm text-gray-300 hover:bg-dark-600"
                        >
                            Close
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <h4 className="text-sm uppercase tracking-wider text-gray-500 font-bold mb-4">Cognitive Pattern Map</h4>
                            <div className="aspect-video bg-dark-900 rounded border border-dark-border flex items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-linear-to-br from-primary-900/20 to-transparent"></div>
                                <div className="relative z-10 text-center px-4">
                                    <div className="text-4xl font-black text-primary-500/50 mb-2">
                                        {(selectedSession.typingSpeed || 0) > 30 ? 'FLOW STATE' : 'DEEP THINKING'}
                                    </div>
                                    <p className="text-gray-400 text-xs">Visual Representation of Session #{selectedSession._id.slice(-4)}</p>
                                </div>
                                <div className="absolute inset-0 opacity-30 pointer-events-none">
                                    <svg width="100%" height="100%">
                                        <circle cx="50%" cy="50%" r={selectedSession.typingSpeed || 20} fill="currentColor" className="text-primary-500 animate-pulse" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between border-b border-dark-border pb-2">
                                <span className="text-gray-400">Typing Speed</span>
                                <span className="text-gray-200 font-mono">{selectedSession.typingSpeed || 0} WPM</span>
                            </div>
                            <div className="flex justify-between border-b border-dark-border pb-2">
                                <span className="text-gray-400">Duration</span>
                                <span className="text-gray-200 font-mono">{selectedSession.sessionTime ? `${Math.floor(selectedSession.sessionTime / 60)}m` : '0m'}</span>
                            </div>
                            <div className="flex justify-between border-b border-dark-border pb-2">
                                <span className="text-gray-400">Backspaces</span>
                                <span className="text-gray-200 font-mono">{selectedSession.backspaceCount || 0}</span>
                            </div>
                            <div className="flex justify-between border-b border-dark-border pb-2">
                                <span className="text-gray-400">Avg Pause Time</span>
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
                                <th className="px-6 py-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-border">
                            {sessions.map((session) => (
                                <tr
                                    key={session._id}
                                    className={clsx(
                                        "transition-colors",
                                        selectedSession?._id === session._id ? "bg-primary-900/20 border-l-2 border-primary-500" : "hover:bg-dark-700/50"
                                    )}
                                >
                                    <td
                                        className="px-6 py-4 font-medium text-gray-300 cursor-pointer"
                                        onClick={() => setSelectedSession(session)}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} className="text-primary-500" />
                                            {new Date(session.createdAt).toLocaleDateString()}
                                            <span className="text-xs text-gray-500 ml-1">
                                                {new Date(session.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </td>
                                    <td
                                        className="px-6 py-4 text-gray-300 cursor-pointer"
                                        onClick={() => setSelectedSession(session)}
                                    >
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
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            type="button"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                handleDelete(session._id);
                                            }}
                                            disabled={deletingId === session._id}
                                            className={clsx(
                                                "inline-flex items-center gap-2 rounded px-3 py-2 text-xs font-semibold transition-colors",
                                                deletingId === session._id
                                                    ? "bg-dark-700 text-gray-400 cursor-not-allowed"
                                                    : "bg-danger/10 text-danger hover:bg-danger/20"
                                            )}
                                        >
                                            <Trash2 size={14} />
                                            {deletingId === session._id ? 'Deleting' : 'Delete'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default History;
