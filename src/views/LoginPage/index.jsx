/* global Kakao */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ICON } from "constant";

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const handleUsernameChange = (event) => setUsername(event.target.value);
  const handlePasswordChange = (event) => setPassword(event.target.value);

  useEffect(() => {
    const ilovesales_url = 'https://www.ilovesales.site/';
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const customParam = params.get('customParam');
    console.log('Token:', token);
    console.log('Custom Param:', customParam);

    /* 
    from which page was redirected 
    check if its ilovesales.site 
    */
    const referrer = document.referrer;
    console.log('Referrer:', referrer);
    if (referrer.includes('ilovesales.site')) {
      console.log('This page was accessed via redirection from:', referrer);

      if (customParam) {
        checkValid(customParam).then(isValid => {
          if (isValid) {
            // new login method(ilovesales) successful, navigate to init page
            window.location.href = `${process.env.REACT_APP_PAGE}/init`;
          } else {
            alert('프로메테우스 서비스는 유료 상품으로 제공되고 있습니다. 아이러브세일즈 페이지를 참고해주세요.');
            // window.location.href = ilovesales_url;
          }
        });
      } else {
        alert('유효하지 않은 접근입니다.');
        // window.location.href = ilovesales_url;
      }
    } else {
      alert('잘못된 접근입니다. 아이러브세일즈를 통해 접근해주세요.');
      //console.log('Referrer:', referrer);
      //window.location.href = ilovesales_url;
    }
  }, [navigate]);

  const checkValid = async (uid) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/check-valid`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid })
      });
      const data = await response.json();
      return data.isValid;
    } catch (error) {
      console.error('Error checking validity:', error);
      return false;
    }
  };

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
        const data = await response.json();
        if (response.ok) {
            navigate('/init');
            // window.location.href = `${process.env.REACT_APP_PAGE}/init`;
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        alert('로그인 실패: ' + error.message);
    }
  };

  const handleKakaoLogin = () => {
    Kakao.Auth.authorize({
      redirectUri: `${process.env.REACT_APP_API_ENDPOINT}/auth/kakao/callback`,
    });
  };

  const handleNaverLogin = () => {
    const clientId = 'UgWovRvNUhyUrNmJ5MtR';  // 네이버에서 발급받은 Client ID
    const redirectUri = encodeURIComponent('http://localhost:3000/naver-callback'); // 네이버 개발자 센터에 등록된 리다이렉트 URI
    const state = encodeURIComponent(Math.random().toString(36).substr(2, 11)); // CSRF 공격 방지를 위한 상태 값
    const loginUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`;
    window.location.href = loginUrl; // 네이버 로그인 페이지로 리다이렉트
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
          <div className="social-login">
            <button className="social-button kakao-login" onClick={handleKakaoLogin}>
              <img src={ICON.KAKAO_LOGIN} alt="Kakao" />
              <span>카카오 로그인</span>
            </button>
            <button className="social-button naver-login" onClick={handleNaverLogin}>
              <img src={ICON.NAVER_LOGIN} alt="Naver" />
              <span>네이버 로그인</span>
            </button>
          </div>
          {/* 로그인 폼 또 기타 컨텐츠 */}
        </div>
      </form>
    </div>
  );
}

export default Login;