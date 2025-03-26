import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ICON } from "constant";
import { Link } from 'react-router-dom';

function Signup() {
  // 상태 변수 설정
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [usernameAvailable, setUsernameAvailable] = useState(true);
  const [usernameValid, setUsernameValid] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);
  const [verificationCode, setVerificationCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false); 
  // 이벤트 핸들러
  const navigate = useNavigate();
  const handleUsernameChange = (event) => {
    const value = event.target.value;
    setUsername(value);
      const isValid = /^[a-zA-Z0-9]{4,}$/.test(value);
    setUsernameValid(isValid || value === '');
  };
  const checkUsernameAvailability = async () => {
    if (!username) {
        alert("아이디를 입력해주세요.");
        return;
    }
    try {
        const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/check-username?username=${username}`);
        // const response = await fetch(`https://metheus.store/check-username?username=${username}`);
        const data = await response.json();
        setUsernameAvailable(data.isAvailable);
        if (data.isAvailable) {
            alert("사용 가능한 아이디입니다.");
        } else {
            alert("이미 사용 중인 아이디입니다.");
        }
    } catch (error) {
        console.error('아이디 중복 검사 중 에러 발생:', error);
        alert("아이디 중복 검사 중 에러가 발생했습니다.");
    }
};
  const handlePasswordChange = (event) => {
    const value = event.target.value;
    setPassword(value);
    const isValid = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(value);
    setPasswordValid(isValid || value === '');
  };
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
};
  const handlePasswordConfirmChange = (event) => {
    const confirmValue = event.target.value;
    setPasswordConfirm(confirmValue);
    setPasswordsMatch(password === confirmValue);
  };
  const handlePhoneNumberChange = (event) => {
      setPhoneNumber(event.target.value);
  };

  const handleSubmit = async (event) => {
      event.preventDefault();
      if (!usernameValid) {
        alert('형식에 맞는 아이디를 입력해주세요.');
        return;
      }
      if (!passwordValid) {
          alert('형식에 맞는 비밀번호를 입력해주세요.');
          return;
      }
      if (!usernameAvailable) {
        alert('이미 사용 중인 아이디입니다. 다른 아이디를 입력해주세요.');
        return;
    }if (password !== passwordConfirm) {
            alert('입력한 비밀번호가 일치하지 않습니다. 다시 확인해주세요.');
            return;
        }
      if(!isVerified){
        alert('인증을 완료해야 합니다.');
        return;
      }
      try {
        const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password,
                phoneNumber: phoneNumber,
                email: email
            })
        });

        const data = await response.json();

        // 성공적으로 회원가입 처리가 완료되면
        if (response.ok) {
          alert('회원가입 완료되었습니다.');
          navigate('/'); // 로그인 페이지로 리디렉션
        } else {
            throw new Error(data.message || '회원가입에 실패했습니다.');
        }
    } catch (error) {
        console.error('회원가입 에러:', error);
        alert(error.message);
    }
  };
  const sendVerificationCode = async (event) => {
    if (!phoneNumber) {
      alert('휴대폰 번호를 입력해주세요.');
      return;
  }
    event.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/send-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber })
      });
      const data = await response.json();
      if (response.ok) {
        setCodeSent(true);
        alert('인증 코드가 발송되었습니다.');
      } else {
        throw new Error(data.message || '인증 코드 발송 실패');
      }
    } catch (error) {
      console.error('인증 코드 발송 에러:', error);
      alert(error.message);
    }
  };

  const verifyCode = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, verificationCode })
      });
      const data = await response.json();
      if (response.ok) {
        setIsVerified(true);
        alert('휴대폰 인증 성공!');
      } else {
        throw new Error('인증번호를 다시 확인해주세요');
      }
    } catch (error) {
      alert(error.message);
    }
  };
  
  const handleKakaoLogin = () => {
    const redirectUri = encodeURIComponent(`${process.env.REACT_APP_PAGE}/oauth`);
    const clientId = '1f19c83bb96331acbdbfdabb55762e7d';
    window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;
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
  // JSX를 사용한 폼 렌더링
  return (
    <div className="signup-modal-overlay">
      <div className="signup-form-container">
        <button className="signup-close-button" onClick={() => navigate('/')}>×</button>
        <div className="signup-header">
          <img src={ICON.LOGO} alt="PRM 로고" className="signup-logo" />
          <h3 className="signup-description">10초만에 회원가입하고 <br /> <strong>무제한 무료</strong>로 견적서 받아보세요!</h3>
        </div>
        <form onSubmit={handleSubmit} className="signup-form">
          <div className={`input-group2 ${!usernameValid && username.length > 0 ? 'has-error' : ''}`}>
            <input
              type="text"
              id="username"
              value={username}
              onChange={handleUsernameChange}
              placeholder="아이디"
              required
            />
            <button type="button" onClick={checkUsernameAvailability} className="check-button">
              중복확인
            </button>
            {(!usernameValid || !usernameAvailable) && (
              <div className="button-error-container">
                {!usernameValid && username.length > 0 && <div className="error-message">아이디는 영문자와 숫자로 4자 이상이어야 합니다.</div>}
                {!usernameAvailable && <div className="error-message">이미 사용 중인 아이디입니다.</div>}
              </div>
            )}
          </div>
          <div className={`input-group2 ${!passwordValid && password.length > 0 ? 'has-error' : ''}`}>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="비밀번호"
              required
            />
            {!passwordValid && <div className="error-message">비밀번호는 영문, 숫자, 특수문자를 포함하여 8자 이상이어야 합니다.</div>}
          </div>
          <div className="input-group2">
            <input
              type="password"
              id="passwordConfirm"
              value={passwordConfirm}
              onChange={handlePasswordConfirmChange}
              placeholder="비밀번호 확인"
              required
            />
            {!passwordsMatch && passwordConfirm.length > 0 && <div className="error-message">비밀번호가 일치하지 않습니다.</div>}
          </div>
          <div className="input-group2">
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="이메일"
              required
            />
          </div>
          <div className="input-group2">
            <input
              type="tel"
              id="phoneNumber"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              placeholder="휴대폰 번호"
              disabled={codeSent}
              required
            />
            <button onClick={sendVerificationCode} disabled={codeSent} className="check-button">
              코드발송
            </button>
          </div>
          {codeSent && (
            <div className="input-group2">
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="인증 코드 입력"
              />
              <button type="button" onClick={verifyCode} disabled={isVerified} className="check-button">
                인증하기
              </button>
            </div>
          )}
          <button type="submit" className="signup-button">회원가입</button>
          <div className="login-link-container">
            이미 프로메테우스 회원이신가요? <Link to="/" className="login-link">로그인</Link>
          </div>
          <div className="separator-container">
            <span className="separator">또는</span>
          </div>
          <div className="social-login-container">
            <button className="auth-button kakao-login" onClick={handleKakaoLogin}>
              <div className="auth-button-icon">
                <img src={ICON.KAKAO_LOGIN} alt="Kakao" />
              </div>
              <span className="auth-button-text">카카오로 시작하기</span>
            </button>
            <button className="auth-button naver-login" onClick={handleNaverLogin}>
              <div className="auth-button-icon">
                <img src={ICON.NAVER_LOGIN} alt="Naver" />
              </div>
              <span className="auth-button-text">네이버로 시작하기</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;