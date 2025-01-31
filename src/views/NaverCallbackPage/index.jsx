import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../ProtectedPage/AuthContext';

function NaverCallback() {
  const navigate = useNavigate();
  const auth = useAuth();
  const requestSent = useRef(false);

  useEffect(() => {
    console.log('NaverCallback 컴포넌트 마운트됨');
    console.log('Auth context:', auth);

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    
    console.log('Naver Callback - Code:', code);
    console.log('Naver Callback - State:', state);
    
    if (requestSent.current) {
      console.log('이미 요청이 진행 중입니다.');
      return;
    }

    if (code && state) {
      requestSent.current = true;

      fetch(`${process.env.REACT_APP_API_ENDPOINT}/naverlogin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ code, state })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Login Response:', data);
        
        if (data.success) {
          console.log('네이버 로그인 성공');
          if (auth && typeof auth.login === 'function') {
            auth.login();
            console.log('로그인 상태 업데이트 완료');
            navigate('/init');
          } else {
            console.error('login 함수를 찾을 수 없습니다');
            navigate('/');
          }
        } else {
          console.error('로그인 실패:', data.message);
          navigate('/');
        }
      })
      .catch(error => {
        console.error('로그인 에러:', error);
        navigate('/');
      })
      .finally(() => {
        requestSent.current = false;
      });
    } else {
      console.error('code 또는 state가 없습니다');
      navigate('/');
    }
  }, [navigate, auth]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        padding: '40px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        textAlign: 'center',
        minWidth: '300px'
      }}>
        <h2 style={{ marginBottom: '20px' }}>네이버 로그인 처리중...</h2>
        <p style={{ color: '#666' }}>잠시만 기다려주세요.</p>
        <p style={{ fontSize: '14px', color: '#888', marginTop: '20px' }}>
          자동으로 페이지가 이동됩니다.
        </p>
      </div>
    </div>
  );
}

export default NaverCallback;
