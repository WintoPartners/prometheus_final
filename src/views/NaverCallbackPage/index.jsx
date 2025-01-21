import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function NaverCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    
    // 저장된 state 값과 비교
    const savedState = sessionStorage.getItem('naverState');
    
    if (code && state && state === savedState) {
      // state 값 검증 후 삭제
      sessionStorage.removeItem('naverState');

      // API 호출
      fetch(`${process.env.REACT_APP_API_ENDPOINT}/naverlogin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ code, state })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          console.log('네이버 로그인 성공');
          window.location.href = `${process.env.REACT_APP_PAGE}/init`;
        } else {
          console.error('로그인 실패:', data.message);
          window.location.href = `${process.env.REACT_APP_PAGE}/`;
        }
      })
      .catch(error => {
        console.error('로그인 에러:', error);
        window.location.href = `${process.env.REACT_APP_PAGE}/`;
      });
    } else {
      console.error('유효하지 않은 접근');
      window.location.href = `${process.env.REACT_APP_PAGE}/`;
    }
  }, [navigate]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}>
      <div>네이버 로그인 처리중...</div>
    </div>
  );
}

export default NaverCallback;
