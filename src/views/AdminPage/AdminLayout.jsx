import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from './AdminAuthContext';
import './AdminPage.css';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdminLoggedIn, adminLogout } = useAdminAuth();

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  if (!isAdminLoggedIn) {
    return <Outlet />;
  }

  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
        <div className="admin-logo">
          <h2>프로메테우스</h2>
          <div className="admin-logo-subtitle">관리자 콘솔</div>
        </div>
        
        <nav className="admin-nav">
          <ul>
            <li>
              <Link to="/admin/dashboard" className={isActive('/admin/dashboard')}>
                <span className="nav-icon">📊</span>
                <span>대시보드</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/users" className={isActive('/admin/users')}>
                <span className="nav-icon">👥</span>
                <span>사용자 관리</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/projects" className={isActive('/admin/projects')}>
                <span className="nav-icon">📁</span>
                <span>프로젝트 목록</span>
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="admin-sidebar-footer">
          <button onClick={handleLogout} className="admin-logout-button">
            <span className="logout-icon">🚪</span>
            <span>로그아웃</span>
          </button>
        </div>
      </div>
      
      <div className="admin-content">
        <header className="admin-header">
          <div className="admin-header-title">
            {location.pathname === '/admin/dashboard' && '대시보드'}
            {location.pathname === '/admin/users' && '사용자 관리'}
            {location.pathname === '/admin/projects' && '프로젝트 목록'}
          </div>
          
          <div className="admin-user-info">
            <span className="admin-user-greeting">관리자님, 환영합니다!</span>
            <div className="admin-header-actions">
              <button onClick={handleLogout} className="admin-logout-button-sm">
                로그아웃
              </button>
            </div>
          </div>
        </header>
        
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 