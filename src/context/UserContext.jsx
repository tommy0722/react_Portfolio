import { createContext, useState, useEffect, useCallback, useMemo } from 'react';

export const UserContext = createContext();

const STORAGE_KEYS = {
    USER_EMAIL: 'user_email',
    USER_NAME: 'user_name',
    ACCESS_TOKEN: 'access',
    REFRESH_TOKEN: 'refresh',
};

export const UserProvider = ({ children }) => {
    const [userEmail, setUserEmail] = useState(null);
    const [userName, setUserName] = useState(null);
    const [loading, setLoading] = useState(true);

    const getStorageItem = useCallback((key) => {
        try {
            return localStorage.getItem(key);
        } catch (error) {
            console.error(`Error reading from localStorage:`, error);
            return null;
        }
    }, []);

    const setStorageItem = useCallback((key, value) => {
        try {
            localStorage.setItem(key, value);
        } catch (error) {
            console.error(`Error writing to localStorage:`, error);
        }
    }, []);

    const removeStorageItem = useCallback((key) => {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error(`Error removing from localStorage:`, error);
        }
    }, []);

    useEffect(() => {
        const initializeUser = () => {
            const email = getStorageItem(STORAGE_KEYS.USER_EMAIL);
            const name = getStorageItem(STORAGE_KEYS.USER_NAME);
            
            if (email) setUserEmail(email);
            if (name) setUserName(name);
            setLoading(false);
        };

        initializeUser();
    }, [getStorageItem]);

    const login = useCallback((email, name) => {
        setStorageItem(STORAGE_KEYS.USER_EMAIL, email);
        setStorageItem(STORAGE_KEYS.USER_NAME, name);
        setUserEmail(email);
        setUserName(name);
    }, [setStorageItem]);

    const logout = useCallback(() => {
        removeStorageItem(STORAGE_KEYS.USER_EMAIL);
        removeStorageItem(STORAGE_KEYS.USER_NAME);
        removeStorageItem(STORAGE_KEYS.ACCESS_TOKEN);
        removeStorageItem(STORAGE_KEYS.REFRESH_TOKEN);
        setUserEmail(null);
        setUserName(null);
    }, [removeStorageItem]);

    const isAuthenticated = useMemo(() => {
        return !!(userEmail && userName);
    }, [userEmail, userName]);

    const contextValue = useMemo(() => ({
        userEmail,
        userName,
        loading,
        isAuthenticated,
        login,
        logout,
    }), [userEmail, userName, loading, isAuthenticated, login, logout]);

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
};
