import React, { useState, useEffect, useRef } from 'react';
import { Search, User, X } from 'lucide-react';
import { userService } from '../services/api';
import clsx from 'clsx';

const UserSearchBar = ({ onSelectUser, selectedUser }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const wrapperRef = useRef(null);

    // Debounce Search
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (query.trim().length >= 2) {
                setLoading(true);
                try {
                    const users = await userService.searchUsers(query);
                    setResults(users);
                    setIsOpen(true);
                } catch (error) {
                    console.error("Search error", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setResults([]);
                setIsOpen(false);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const handleSelect = (user) => {
        setQuery('');
        setIsOpen(false);
        onSelectUser(user);
    };

    const clearSelection = () => {
        onSelectUser(null);
    };

    return (
        <div className="relative w-full max-w-md" ref={wrapperRef}>
            {selectedUser ? (
                <div className="flex items-center justify-between p-2 pl-4 bg-primary-900/20 border border-primary-500/50 rounded-lg">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center text-xs font-bold text-white">
                            {selectedUser.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-gray-200 text-sm font-medium">
                            Comparing with: <span className="text-primary-400">{selectedUser.name}</span>
                        </span>
                    </div>
                    <button onClick={clearSelection} className="p-1 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors">
                        <X size={16} />
                    </button>
                </div>
            ) : (
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search users to compare..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full bg-dark-800 border border-dark-border rounded-lg py-2 pl-10 pr-4 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
                    />
                    {loading && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                    )}
                </div>
            )}

            {/* Dropdown Results */}
            {isOpen && results.length > 0 && !selectedUser && (
                <div className="absolute top-full mt-2 w-full bg-dark-800 border border-dark-border rounded-lg shadow-xl overflow-hidden z-50">
                    <div className="px-3 py-2 text-xs text-gray-500 uppercase font-bold bg-dark-900/50">Suggested Users</div>
                    {results.map((user) => (
                        <button
                            key={user._id}
                            onClick={() => handleSelect(user)}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-dark-700 transition-colors text-left"
                        >
                            <div className="p-2 bg-dark-700/50 rounded-full text-gray-400">
                                <User size={16} />
                            </div>
                            <div>
                                <div className="text-gray-200 text-sm font-medium">{user.name}</div>
                                <div className="text-xs text-gray-500">{user.email}</div>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserSearchBar;
