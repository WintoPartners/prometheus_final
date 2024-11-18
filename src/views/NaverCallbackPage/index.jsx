import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function NaverCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');

    if (code && state) {
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
        if (data.access_token) {
          // 성공적으로 토큰을 받음
          console.log('네이버 로그인 성공', data);
          window.location.href=`${process.env.REACT_APP_PAGE}/init`;
        } else {
          // 실패 처리
          window.location.href=`${process.env.REACT_APP_PAGE}/`;
        }
      })
      .catch(error => {
        console.error('로그인 에러', error);
        window.location.href=`${process.env.REACT_APP_PAGE}/`;
      });
    }
  }, [navigate]);

  return (
    <div>Loading...</div>
  );
}

export default NaverCallback;
