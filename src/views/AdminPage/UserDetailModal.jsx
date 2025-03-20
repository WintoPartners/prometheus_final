import React from 'react';
import './AdminPage.css';

const UserDetailModal = ({ user, onClose }) => {
  if (!user || !user.userInfo) {
    return null;
  }
  
  const { userInfo, projects } = user;
  
  // 로그인 유형에 따른 표시 이름 설정
  const getLoginTypeName = (type) => {
    switch(type) {
      case 'kakao': return '카카오';
      case 'google': return '구글';
      case 'naver': return '네이버';
      case 'local': return '일반';
      default: return type || '정보 없음';
    }
  };
  
  return (
    <div className="admin-modal-backdrop">
      <div className="admin-modal">
        <div className="admin-modal-header">
          <h3>사용자 상세 정보</h3>
          <button className="admin-modal-close" onClick={onClose}>&times;</button>
        </div>
        
        <div className="admin-modal-body">
          <h4>기본 정보</h4>
          <table className="admin-table detail-table">
            <tbody>
              <tr>
                <td><strong>사용자</strong></td>
                <td style={{ color: '#333' }}>{userInfo.user_id || userInfo.id}</td>
              </tr>
              <tr>
                <td><strong>ID</strong></td>
                <td style={{ color: '#333' }}>{userInfo.username}</td>
              </tr>
              <tr>
                <td><strong>이메일</strong></td>
                <td style={{ color: '#333' }}>{userInfo.email}</td>
              </tr>
              <tr>
                <td><strong>연락처</strong></td>
                <td style={{ color: '#333' }}>{userInfo.phone || '-'}</td>
              </tr>
              <tr>
                <td><strong>로그인 유형</strong></td>
                <td>
                  <span className={`login-type login-type-${userInfo.login_type}`}>
                    {getLoginTypeName(userInfo.login_type)}
                  </span>
                </td>
              </tr>
              <tr>
                <td><strong>가입일</strong></td>
                <td style={{ color: '#333' }}>{new Date(userInfo.created_at).toLocaleDateString()}</td>
              </tr>
              <tr>
                <td><strong>최근 로그인</strong></td>
                <td style={{ color: '#333' }}>{userInfo.last_login ? new Date(userInfo.last_login).toLocaleDateString() : '정보 없음'}</td>
              </tr>
              <tr>
                <td><strong>계정 상태</strong></td>
                <td>
                  <span className={`status-badge status-${userInfo.status?.toLowerCase() || 'active'}`}>
                    {userInfo.status || '활성'}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
          
          <h4>프로젝트</h4>
          {projects && projects.length > 0 ? (
            <table className="admin-table project-table">
              <thead>
                <tr>
                  <th>프로젝트 ID</th>
                  <th>이름</th>
                  <th>생성일</th>
                </tr>
              </thead>
              <tbody>
                {projects.map(project => (
                  <tr key={project.id}>
                    <td style={{ color: '#333' }}>{project.id}</td>
                    <td style={{ color: '#333', fontWeight: '500' }}>{project.name}</td>
                    <td style={{ color: '#333' }}>{new Date(project.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-data-message">프로젝트가 없습니다.</p>
          )}
        </div>
        
        <div className="admin-modal-footer">
          <button onClick={onClose} className="admin-action-button close-button">닫기</button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal; 