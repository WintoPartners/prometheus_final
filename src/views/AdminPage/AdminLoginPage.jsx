import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from './AdminAuthContext';

const AdminLoginPage = () => {
  // 개발 환경에서는 환경 변수에서 기본값을 가져옵니다
  const defaultUsername = process.env.REACT_APP_STAGE === 'development' ? '' : '';
  const defaultPassword = process.env.REACT_APP_STAGE === 'development' ? '' : '';

  const [username, setUsername] = useState(defaultUsername);
  const [password, setPassword] = useState(defaultPassword);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { adminLogin, isAdminLoggedIn } = useAdminAuth();
  const navigate = useNavigate();
  
  // 이미 로그인되어 있으면 대시보드로 리다이렉트
  useEffect(() => {
    if (isAdminLoggedIn) {
      navigate('/admin/dashboard');
    }
  }, [isAdminLoggedIn, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      console.log(`로그인 시도: ${username}`);
      const success = await adminLogin(username, password);
      if (success) {
        navigate('/admin/dashboard');
      } else {
        setError('아이디 또는 비밀번호가 올바르지 않습니다.');
      }
    } catch (err) {
      setError('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
      console.error('로그인 오류:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-form">
        <h2>관리자 로그인</h2>
        
        {error && <div className="admin-error-message" style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label htmlFor="username">아이디</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div className="admin-form-group">
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="admin-submit-button"
            disabled={loading}
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>
        
        {process.env.REACT_APP_STAGE === 'development' && (
          <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
            개발 환경: 기본 로그인 정보가 자동으로 입력됩니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLoginPage; 