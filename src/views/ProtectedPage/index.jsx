import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

function ProtectedRoute({ children }) {
  const { isLoggedIn, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>로그인이 필요합니다.</div>;  // 로딩 표시 또는 로딩 컴포넌트
  }

  if (!isLoggedIn) {
    alert("로그인이 필요합니다.");
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
