import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                // Ideally verify token with backend /me endpoint here
                // For now, we decode basic info or trust it until 401
                try {
                    const payload = JSON.parse(atob(storedToken.split('.')[1]));
                    setUser({ id: payload.userId, email: payload.email });
                } catch (e) {
                    localStorage.removeItem('token');
                    setToken(null);
                }
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const data = await authService.login(email, password);
            localStorage.setItem('token', data.token);
            setToken(data.token);

            // Decode to set user immediately
            const payload = JSON.parse(atob(data.token.split('.')[1]));
            setUser({ id: payload.userId });
            return true;
        } catch (error) {
            console.error("Login failed", error);
            throw error;
        }
    };

    const register = async (email, password) => {
        try {
            await authService.register(email, password);
            return true;
        } catch (error) {
            console.error("Registration failed", error);
            throw error;
        }
    };

    const logout = () => {
        authService.logout();
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
