/* global Kakao */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ICON } from "constant";

function Login() {
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const handleUsernameChange = (event) => setUsername(event.target.value);
    const handlePasswordChange = (event) => setPassword(event.target.value);
    useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');
      console.log('Token:', token);
    
      if (token) {
        localStorage.setItem('kakao_token', token);
        console.log('Navigating to: /init');
        navigate('/init');  // 절대 경로로 /init을 사용
      }
    }, [navigate]);
    
    useEffect(() => {
      // 카카오 SDK 초기화
      if (!window.Kakao.isInitialized()) {
        window.Kakao.init('e42a4789fd64d1bf0e771564a7dfe338');
        //여기에 javascript 키를 넣기
      }
    }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
        const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/login`, {
            method: 'POST',
            credentials: 'include',  
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                password
            })
        });
        // const response = await fetch('https://metheus.store/login', {
        //     method: 'POST',
        //     credentials: 'include',  
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //         username,
        //         password
        //     })
        // });
        const data = await response.json();
        if (response.ok) {
            if (process.env.NODE_ENV === 'development') {
                window.location.href = 'http://localhost:3000/init';
            } else {
                window.location.href = `${process.env.REACT_APP_PAGE}/init`;
            }
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        alert('로그인 실패: ' + error.message);
    }
};

  const handleKakaoLogin = () => {
    const clientId = process.env.REACT_APP_KAKAO_CLIENT_ID;
    const redirectUri = process.env.REACT_APP_STAGE === 'development'
      ? 'http://localhost:3000/oauth'
      : 'https://app.metheus.pro/oauth';  // 프로덕션 환경의 실제 도메인

    const kakaoLoginUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}`;
    
    console.log('Kakao Login URL:', kakaoLoginUrl); // 디버깅용
    window.location.href = kakaoLoginUrl;
  };
  
  const handleNaverLogin = () => {
    const clientId = process.env.REACT_APP_NAVER_CLIENT_ID;
    // 개발 환경과 프로덕션 환경의 URL을 구분
    const redirectUri = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3000/naver-callback'
      : `${process.env.REACT_APP_PAGE}/naver-callback`;
    const state = Math.random().toString(36).substr(2, 11);
    
    // state 값 저장
    sessionStorage.setItem('naverState', state);
    
    const naverLoginUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`;
    window.location.href = naverLoginUrl;
  };
  
  return (
    <div className="container">
            <form className="login-form" onSubmit={handleLogin}>
            <div className="login-image-part">
              <img src={ICON.BACK} alt="Login Visual" style={{ width: '100%', height: '100%' }} />
            </div>
            <div className="login-input-part">
              <h2>로그인</h2>
              <div className="input-group">
                <label htmlFor="username">아이디</label>
                <input type="text" id="username" value={username} onChange={handleUsernameChange} required placeholder="Enter ID" />
              </div>
              <div className="input-group">
                <label htmlFor="username">비밀번호</label>
                <input type="password" id="password" value={password} onChange={handlePasswordChange} required placeholder="********" />
              </div>
              <button type="submit" className="login-button">로그인</button>
              <div className="link-buttons">
                <button className="link-button" onClick={() => navigate('/findId')}>아이디 찾기</button>
                <span className="divider">|</span>
                <button className="link-button" onClick={() => navigate('/findPassword')}>비밀번호 찾기</button>
                <span className="divider">|</span>
                <button className="link-button" onClick={() => navigate('/signup')}>회원가입</button>
              </div>
              <div className="separator-container">
                <span className="separator">또는</span>
              </div>
              <div className="social-login-container">
                <button className="auth-button kakao-login" onClick={handleKakaoLogin}>
                  <div className="auth-button-icon">
                    <img src={ICON.KAKAO_LOGIN} alt="Kakao" />
                  </div>
                  <span className="auth-button-text">카카오로 로그인</span>
                </button>
                <button className="auth-button naver-login" onClick={handleNaverLogin}>
                  <div className="auth-button-icon">
                    <img src={ICON.NAVER_LOGIN} alt="Naver" />
                  </div>
                  <span className="auth-button-text">네이버로 로그인</span>
                </button>
              </div>
            {/* 로그인 폼 또는 기타 컨텐츠 */}
            </div>
            </form>
          </div>
  );
}

export default Login;