import React, { createContext, useContext, useState, useEffect } from 'react';

// Context 생성
const AuthContext = createContext({ isLoggedIn: false, isLoading: true });

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

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
        <AuthContext.Provider value={{ isLoggedIn, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
