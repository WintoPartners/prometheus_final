import React, { useState, useEffect } from 'react';
import adminApi from '../../utils/adminApi';
import UserDetailModal from './UserDetailModal';
import './AdminPage.css';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminApi.get('/admin/users');
      setUsers(response.data.data);
      setError('');
    } catch (err) {
      console.error('사용자 목록 로딩 실패:', err);
      setError('사용자 데이터를 로드하는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewUser = async (userId) => {
    try {
      const response = await adminApi.get(`/admin/users/${userId}`);
      setSelectedUser(response.data.data);
      setShowModal(true);
    } catch (err) {
      console.error('사용자 상세정보 로딩 실패:', err);
      alert('사용자 정보를 불러오는데 실패했습니다.');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('정말 이 사용자를 삭제하시겠습니까?')) {
      try {
        await adminApi.delete(`/admin/users/${userId}`);
        setUsers(users.filter(user => user.id !== userId));
        alert('사용자가 삭제되었습니다.');
      } catch (err) {
        console.error('사용자 삭제 실패:', err);
        alert('사용자 삭제에 실패했습니다.');
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

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

  return (
    <div className="users-page-container">
      <h2 className="page-title">사용자 관리</h2>
      
      <div className="admin-table-container">
        {users.length > 0 ? (
          <table className="admin-table user-table">
            <thead>
              <tr>
                <th>사용자</th>
                <th>ID</th>
                <th>이메일</th>
                <th>연락처</th>
                <th>로그인 유형</th>
                <th>가입일</th>
                <th style={{ width: '100px' }}>액션</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td style={{ color: '#333' }}>{user.user_id || user.id}</td>
                  <td style={{ color: '#333', fontWeight: '500' }}>{user.username}</td>
                  <td style={{ color: '#333' }}>{user.email}</td>
                  <td style={{ color: '#333' }}>{user.phone || '-'}</td>
                  <td>
                    <span className={`login-type login-type-${user.login_type}`}>
                      {getLoginTypeName(user.login_type)}
                    </span>
                  </td>
                  <td style={{ color: '#333' }}>{new Date(user.created_at).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="admin-action-button admin-view-button"
                        onClick={() => handleViewUser(user.id)}
                      >
                        상세
                      </button>
                      <button 
                        className="admin-action-button admin-delete-button"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-data-message">등록된 사용자가 없습니다.</p>
        )}
      </div>
      
      {showModal && selectedUser && (
        <UserDetailModal user={selectedUser} onClose={closeModal} />
      )}
    </div>
  );
};

export default UsersPage; 