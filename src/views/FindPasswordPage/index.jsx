import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function FindPwPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [foundPw, setFoundPw] = useState(null);
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const handlePhoneNumberChange = (event) => {
    setPhoneNumber(event.target.value);
  };
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
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

  const findPw = async () => {
    if (!username) {
      alert('아이디 입력을 완료해주세요.');
      return;
    }
    if (!isVerified) {
      alert('휴대폰 인증을 완료해주세요.');
      return;
    }
    try {
      const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/find-pw`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber,username })
      });
      const data = await response.json();
      if (response.ok) {
        setFoundPw(data.password);  // 예시로 'username' 필드가 반환된다고 가정
        setError('');
        alert('비밀번호가 등록하신 이메일로 전송되었습니다.');
      } else {
        throw new Error(data.message || '비밀번호 찾기에 실패했습니다.');
      }
    } catch (error) {
      console.error('비밀번호 찾기 에러:', error);
      setError(error.message);
    }
  };
  return (
    <div className="find-id-form-container">
      <form className="signup-form">
      <h2>비밀번호 찾기</h2>
      <div className="input-group2">
          <input type="text" id="username" value={username} onChange={handleUsernameChange} required placeholder="아이디"/>
      </div>
      <div className="input-group2">
        <input
          type="tel"
          id="phoneNumber"
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          placeholder="휴대폰 번호"
          disabled={codeSent}
        />
        <button onClick={sendVerificationCode} disabled={codeSent} className="check-button">
          코드발송
        </button>
      </div>
      
      {codeSent && (
        <>
        <div className="input-group2">
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="인증 코드"
          />
          <button type="button" onClick={verifyCode} disabled={isVerified} className="check-button">
            인증하기
          </button>
          </div>
        </>
      )}
        <button type="button" onClick={findPw} className="signup-button" disabled={foundPw}>
          비밀번호 찾기
        </button>
      {foundPw && (
        <>
        </>
        )}
      {error && <p style={{ color: 'red', margin:'20px 0 0 0 ' }}>{error}</p>}
      <p style={{ color:'#fff', marginTop:'30px', textAlign:'left' }}><Link to="/" style={{ color: 'rgb(97 139 255)', textDecoration: 'none' }}>로그인페이지 돌아가기</Link></p>
      </form>
    </div>
  );
}

export default FindPwPage;
