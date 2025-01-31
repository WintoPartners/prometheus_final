import React, { createContext, useContext, useState, useEffect } from 'react';

// Context 생성
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const login = () => {
        setIsLoggedIn(true);
        setIsLoading(false);
    };

    const logout = () => {
        setIsLoggedIn(false);
        setIsLoading(false);
    };

    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/protected`, {
                    method: 'GET',
                    credentials: 'include'
                });
                // const response = await fetch('https://metheus.store/protected', {
                //     method: 'GET',
                //     credentials: 'include'
                // });
                const data = await response.json();
                setIsLoggedIn(data.isLoggedIn);
            } catch (error) {
                console.error('Session check failed', error);
                setIsLoggedIn(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkSession();
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
