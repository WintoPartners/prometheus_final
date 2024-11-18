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
    const clientId = 'UgWovRvNUhyUrNmJ5MtR';  // 네이버에서 발급받은 Client ID
    const redirectUri = encodeURIComponent(`${process.env.REACT_APP_PAGE}/noauth`);
    const state = "kookytest"; // CSRF 공격 방지를 위해 사용되는 랜덤 문자열
    window.location.href = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`;
  };
  // JSX를 사용한 폼 렌더링
  return (
      <div className="signup-form-container">
      <form onSubmit={handleSubmit} className="signup-form">
        <h2>회원가입</h2>
        <div className="input-group2">
          <input type="text" id="username" value={username} onChange={handleUsernameChange} required placeholder="아이디" />
          <button type="button" onClick={checkUsernameAvailability} className="check-button">중복확인</button>
          {!usernameValid && <p className="error-message">* 4자리 이상의 영문 혹은 영문, 숫자를 조합하여 입력해 주세요</p>}
        </div>
        <div className="input-group2">
          <input type="password" id="password" value={password} onChange={handlePasswordChange} required placeholder="비밀번호" />
          {!passwordValid && <p className="error-message">* 영문, 숫자, 특수문자를 조합하여 8자리 이상 입력해 주세요</p>}
        </div>
        <div className="input-group2">
          <input type="password" id="password-confirm" value={passwordConfirm} onChange={handlePasswordConfirmChange} required placeholder="비밀번호 확인" />
          {!passwordsMatch && <p className="error-message">비밀번호가 일치하지 않습니다.</p>}
        </div>
        <div className="input-group2">
          <input type="email" id="email" value={email} onChange={handleEmailChange} required placeholder="이메일" />
        </div>
        <div className="input-group2">
          <input type="tel" id="phoneNumber" value={phoneNumber} onChange={handlePhoneNumberChange} required placeholder="휴대폰번호" />
          <button onClick={sendVerificationCode} className="check-button" disabled={codeSent}>코드발송</button>
        </div>
        {codeSent && (
          <div className="input-group2">
            <input type="text" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} placeholder="인증 코드 입력" />
            <button type="button" onClick={verifyCode} className="check-button" disabled={isVerified}>인증하기</button>
          </div>
        )}
        <button type="submit" className="signup-button">회원가입</button>
        <div className="separator-container">
          <span className="separator">또는</span>
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
        <p style={{ color: '#fff', marginTop: '30px', textAlign: 'center' }}>이미 프로메테우스 회원이신가요? <Link to="/" style={{ color: 'rgb(97 139 255)', textDecoration: 'none' }}>로그인</Link></p>
      </form>
    </div>
  );
}

export default Signup;