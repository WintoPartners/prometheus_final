import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './ProtectedPage.css';

function ProtectedRoute({ children }) {
  const { isLoggedIn, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="login-required-container">
        <div className="login-required-card">
          <div className="login-icon">🔒</div>
          <h2 className="login-title">로그인이 필요합니다</h2>
          <p className="login-message">페이지에 접근하기 위해 로그인이 필요합니다.</p>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    alert("로그인이 필요합니다.");
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
