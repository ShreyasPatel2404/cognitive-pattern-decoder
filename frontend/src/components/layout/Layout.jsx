import React from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <div className="flex h-screen bg-dark-900 text-gray-300 overflow-hidden font-sans">
            <Sidebar />
            <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
                {/* Top bar could go here if needed, keeping it simple for now as per dashboard spec */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
