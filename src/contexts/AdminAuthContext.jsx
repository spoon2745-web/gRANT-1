'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const AdminAuthContext = createContext(undefined);

export function useAdminAuth() {
    const context = useContext(AdminAuthContext);
    if (context === undefined) {
        throw new Error('useAdminAuth must be used within an AdminAuthProvider');
    }
    return context;
}

export function AdminAuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check authentication on mount
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = () => {
        const authData = localStorage.getItem('adminAuth');
        if (!authData) {
            setIsAuthenticated(false);
            return false;
        }
        try {
            const { timestamp, authenticated } = JSON.parse(authData);
            const now = Date.now();
            const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours

            // Check if session is still valid
            if (authenticated && (now - timestamp) < sessionDuration) {
                setIsAuthenticated(true);
                return true;
            }
            else {
                // Session expired
                localStorage.removeItem('adminAuth');
                setIsAuthenticated(false);
                return false;
            }
        }
        catch (error) {
            localStorage.removeItem('adminAuth');
            setIsAuthenticated(false);
            return false;
        }
    };

    const login = async (password) => {
        // Hardcoded passwords for development or fallback
        const hardcodedPasswords = [
            'grant2024', // Main admin password
            'admin123' // Alternative admin password
        ];

        // Fetch support password from database via API
        let dbPassword = null;
        try {
            const response = await fetch('/api/admin/settings');
            if (response.ok) {
                const data = await response.json();
                dbPassword = data.settings?.supportPassword;
            } else {
                console.error("Failed to fetch settings from API:", response.status, response.statusText);
            }
        } catch (error) {
            console.error("Failed to fetch settings for login:", error);
        }

        const validPasswords = [...hardcodedPasswords];
        if (dbPassword) {
            validPasswords.push(dbPassword);
        }

        if (validPasswords.includes(password.trim())) {
            const authData = {
                authenticated: true,
                timestamp: Date.now()
            };
            localStorage.setItem('adminAuth', JSON.stringify(authData));
            setIsAuthenticated(true);
            return true;
        }
        return false;
    };

    const logout = () => {
        localStorage.removeItem('adminAuth');
        localStorage.removeItem('adminSettingsAuth'); // Clear old auth
        setIsAuthenticated(false);
    };

    const value = {
        isAuthenticated,
        login,
        logout,
        checkAuth
    };

    return (
        <AdminAuthContext.Provider value={value}>
            {children}
        </AdminAuthContext.Provider>
    );
}
