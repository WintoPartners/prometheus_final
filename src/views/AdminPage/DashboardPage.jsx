import React, { useState, useEffect } from 'react';
import adminApi from '../../utils/adminApi';
import './AdminPage.css';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminApi.get('/admin/stats');
        setStats(response.data.data);
        setError('');
      } catch (err) {
        console.error('통계 로딩 실패:', err);
        setError('통계 데이터를 로드하는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const getLoginTypeName = (type) => {
    switch(type) {
      case 'kakao': return '카카오';
      case 'google': return '구글';
      case 'naver': return '네이버';
      case 'local': return '일반';
      default: return type || '정보 없음';
    }
  };

  if (loading) {
    return <div className="admin-loading">데이터를 불러오는 중...</div>;
  }

  if (error) {
    return <div className="admin-error">{error}</div>;
  }

  if (!stats) {
    return <div className="no-data-message">통계 데이터가 없습니다.</div>;
  }

  return (
    <div className="dashboard-container">
      <h2 className="page-title">대시보드</h2>
      
      <div className="admin-dashboard">
        <div className="admin-card">
          <h3 className="admin-card-title">총 사용자 수</h3>
          <p className="admin-card-value">{stats.userCount}</p>
        </div>
        
        <div className="admin-card">
          <h3 className="admin-card-title">총 프로젝트 수</h3>
          <p className="admin-card-value">{stats.projectCount}</p>
        </div>
        
      </div>
      
      <div className="admin-recent-users">
        <h3>최근 가입자</h3>
        {stats.recentUsers && stats.recentUsers.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>이름</th>
                <th>이메일</th>
                <th>로그인 유형</th>
                <th>가입일</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentUsers.map((user) => (
                <tr key={user.id}>
                  <td style={{ color: '#333', fontWeight: '500' }}>{user.username}</td>
                  <td style={{ color: '#333' }}>{user.email}</td>
                  <td>
                    {user.login_type && (
                      <span className={`login-type login-type-${user.login_type}`}>
                        {getLoginTypeName(user.login_type)}
                      </span>
                    )}
                  </td>
                  <td style={{ color: '#333' }}>{new Date(user.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-data-message">최근 가입자가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default DashboardPage; 