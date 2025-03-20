import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// 환경에 따른 API URL 설정
console.log('AdminAuthContext - 현재 REACT_APP_STAGE 값:', process.env.REACT_APP_STAGE);
console.log('AdminAuthContext - 현재 REACT_APP_API_ENDPOINT 값:', process.env.REACT_APP_API_ENDPOINT);

const API_URL = process.env.REACT_APP_STAGE !== 'development' 
  ? `${process.env.REACT_APP_API_ENDPOINT}` 
  : 'http://localhost:8080';

console.log(`AdminAuthContext - API URL: ${API_URL}`);

// Context 생성
const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const adminLogin = async (username, password) => {
        try {
            // 백엔드 API URL 확인 로그
            console.log(`API URL: ${API_URL}`);
            
            const response = await axios.post(`${API_URL}/api/admin/login`, { 
                username, 
                password 
            });
            
            if (response.data.success) {
                localStorage.setItem('adminToken', response.data.token);
                setIsAdminLoggedIn(true);
                return true;
            }
            return false;
        } catch (error) {
            console.error('관리자 로그인 실패:', error);
            return false;
        }
    };

    const adminLogout = () => {
        localStorage.removeItem('adminToken');
        setIsAdminLoggedIn(false);
    };

    useEffect(() => {
        const checkAdminSession = async () => {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                setIsAdminLoggedIn(false);
                setIsLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${API_URL}/api/admin/check`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
                setIsAdminLoggedIn(response.data.success && response.data.admin);
            } catch (error) {
                console.error('관리자 세션 확인 실패', error);
                setIsAdminLoggedIn(false);
                localStorage.removeItem('adminToken');
            } finally {
                setIsLoading(false);
            }
        };

        checkAdminSession();
    }, []);

    return (
        <AdminAuthContext.Provider value={{ isAdminLoggedIn, isLoading, adminLogin, adminLogout }}>
            {children}
        </AdminAuthContext.Provider>
    );
}

export function useAdminAuth() {
    const context = useContext(AdminAuthContext);
    if (!context) {
        throw new Error('useAdminAuth must be used within an AdminAuthProvider');
    }
    return context;
} 