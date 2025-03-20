import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../views/AdminPage/AdminAuthContext';
import '../style/admin.css';

const AdminLayout = () => {
  const { isAdminLoggedIn, adminLogout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    adminLogout();
    navigate('/admin');
  };

  if (!isAdminLoggedIn) {
    return <Outlet />;
  }

  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
        <div className="admin-logo">
          <h2>관리자 페이지</h2>
        </div>
        <nav className="admin-nav">
          <ul>
            <li>
              <Link to="/admin/dashboard">대시보드</Link>
            </li>
            <li>
              <Link to="/admin/users">사용자 관리</Link>
            </li>
            <li>
              <Link to="/admin/projects">프로젝트 목록</Link>
            </li>
          </ul>
        </nav>
      </div>
      
      <div className="admin-content">
        <header className="admin-header">
          <div className="admin-header-title">
            <h1>Metheus 관리자</h1>
          </div>
          <div className="admin-header-actions">
            <button onClick={handleLogout} className="logout-button">
              로그아웃
            </button>
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