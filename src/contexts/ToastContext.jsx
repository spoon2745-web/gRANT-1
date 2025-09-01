'use client';
import React, { createContext, useContext, useState, useCallback } from 'react';
const ToastContext = createContext(undefined);
export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);
    const addToast = useCallback((toast) => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newToast = { ...toast, id };
        setToasts(prev => [...prev, newToast]);
        // Auto-remove toast after duration
        const duration = toast.duration || 5000;
        setTimeout(() => {
            removeToast(id);
        }, duration);
    }, [removeToast]);
    const success = useCallback((title, message, duration) => {
        addToast({ title, message, type: 'success', duration });
    }, [addToast]);
    const error = useCallback((title, message, duration) => {
        addToast({ title, message, type: 'error', duration });
    }, [addToast]);
    const warning = useCallback((title, message, duration) => {
        addToast({ title, message, type: 'warning', duration });
    }, [addToast]);
    const info = useCallback((title, message, duration) => {
        addToast({ title, message, type: 'info', duration });
    }, [addToast]);
    return (<ToastContext.Provider value={{
            toasts,
            addToast,
            removeToast,
            success,
            error,
            warning,
            info
        }}>
      {children}
    </ToastContext.Provider>);
}
export function useToast() {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
