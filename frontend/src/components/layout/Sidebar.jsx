import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import {
    LayoutDashboard,
    Activity,
    History,
    Settings,
    ChevronLeft,
    ChevronRight,
    BrainCircuit,
    LogOut,
    LogIn,
    UserPlus
} from 'lucide-react';
import clsx from 'clsx';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();

    const allNavItems = [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard, public: true },
        { path: '/session-analysis', label: 'Session Analysis', icon: Activity, public: false },
        { path: '/history', label: 'History', icon: History, public: false },
        { path: '/settings', label: 'Settings', icon: Settings, public: false },
    ];

    const visibleNavItems = allNavItems.filter(item => item.public || user);

    const handleLogout = () => {
        logout();
        navigate('/'); // Go to public dashboard on logout
    };

    return (
        <aside
            className={clsx(
                "h-screen bg-dark-800 border-r border-dark-border flex flex-col transition-all duration-300 relative z-20",
                collapsed ? "w-16" : "w-64"
            )}
        >
            {/* Header */}
            <div className="h-16 flex items-center px-4 border-b border-dark-border overflow-hidden whitespace-nowrap">
                <BrainCircuit className="text-primary-500 min-w-8" size={32} />
                <span className={clsx(
                    "ml-3 font-bold text-gray-100 text-lg transition-opacity duration-300",
                    collapsed ? "opacity-0 w-0" : "opacity-100"
                )}>
                    CPD Platform
                </span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 flex flex-col gap-1 overflow-y-auto overflow-x-hidden">
                {visibleNavItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => clsx(
                            "flex items-center px-4 py-3 text-gray-400 hover:text-gray-100 transition-colors border-l-2",
                            isActive
                                ? "border-primary-500 bg-dark-700/50 text-gray-100"
                                : "border-transparent hover:bg-dark-700/30"
                        )}
                        title={collapsed ? item.label : undefined}
                    >
                        <item.icon size={20} className="min-w-5" />
                        <span className={clsx(
                            "ml-3 text-sm font-medium transition-all duration-300 whitespace-nowrap",
                            collapsed ? "opacity-0 translate-x-4" : "opacity-100 translate-x-0"
                        )}>
                            {item.label}
                        </span>
                    </NavLink>
                ))}
            </nav>

            {/* Auth Buttons Area */}
            <div className="p-4 border-t border-dark-border gap-2 flex flex-col">
                {user ? (
                    <button
                        onClick={handleLogout}
                        className="flex items-center px-2 py-2 text-danger hover:bg-dark-700 rounded transition-colors w-full"
                        title="Logout"
                    >
                        <LogOut size={20} className="min-w-5" />
                        <span className={clsx(
                            "ml-3 text-sm font-medium transition-all duration-300 whitespace-nowrap",
                            collapsed ? "opacity-0 w-0" : "opacity-100"
                        )}>
                            Logout
                        </span>
                    </button>
                ) : (
                    <>
                        <button
                            onClick={() => navigate('/login')}
                            className="flex items-center px-2 py-2 text-gray-300 hover:text-primary-400 hover:bg-dark-700 rounded transition-colors w-full"
                            title="Login"
                        >
                            <LogIn size={20} className="min-w-5" />
                            <span className={clsx(
                                "ml-3 text-sm font-medium transition-all duration-300 whitespace-nowrap",
                                collapsed ? "opacity-0 w-0" : "opacity-100"
                            )}>
                                Login
                            </span>
                        </button>
                        <button
                            onClick={() => navigate('/register')}
                            className="flex items-center px-2 py-2 text-primary-500 hover:text-primary-400 hover:bg-dark-700 rounded transition-colors w-full"
                            title="Register"
                        >
                            <UserPlus size={20} className="min-w-5" />
                            <span className={clsx(
                                "ml-3 text-sm font-medium transition-all duration-300 whitespace-nowrap",
                                collapsed ? "opacity-0 w-0" : "opacity-100"
                            )}>
                                Register
                            </span>
                        </button>
                    </>
                )}
            </div>

            {/* Footer / Toggle */}
            <div className="p-4 border-t border-dark-border">
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="w-full flex items-center justify-center p-2 rounded hover:bg-dark-700 text-gray-400 hover:text-gray-100 transition-colors"
                >
                    {collapsed ? <ChevronRight size={16} /> : <div className="flex items-center gap-2"><ChevronLeft size={16} /><span className="text-xs uppercase">Collapse</span></div>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
