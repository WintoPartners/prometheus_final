import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ICON } from "constant";

function FindIdPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [foundId, setFoundId] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [verificationMessage, setVerificationMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();
  
  // 카운트다운 타이머 설정
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0 && codeSent && !canResend) {
      setCanResend(true);
    }
    
    return () => clearTimeout(timer);
  }, [countdown, codeSent, canResend]);

  // 메시지 자동 삭제 타이머 설정 (10초로 연장)
  useEffect(() => {
    let messageTimer;
    if (successMessage) {
      messageTimer = setTimeout(() => {
        setSuccessMessage('');
      }, 10000); // 10초로 연장
    }
    return () => clearTimeout(messageTimer);
  }, [successMessage]);

  useEffect(() => {
    let errorTimer;
    if (error) {
      errorTimer = setTimeout(() => {
        setError('');
      }, 10000); // 10초로 연장
    }
    return () => clearTimeout(errorTimer);
  }, [error]);
  
  const handlePhoneNumberChange = (event) => {
    const newPhoneNumber = event.target.value;
    setPhoneNumber(newPhoneNumber);
    
    if (codeSent && newPhoneNumber !== phoneNumber) {
      // 이미 코드가 발송된 상태에서 번호가 변경된 경우
      setVerificationMessage("전화번호가 변경되었습니다. 새 인증코드를 발송해주세요.");
      setCodeSent(false); // 코드 발송 상태 초기화
      setVerificationCode(""); // 인증코드 초기화
      setIsVerified(false); // 인증 상태 초기화
      setCountdown(0); // 카운트다운 초기화
      setCanResend(false); // 재전송 상태 초기화
    }
  };

  const sendVerificationCode = async (event) => {
    if (!phoneNumber) {
      setError('휴대폰 번호를 입력해주세요.');
      return;
    }
    event.preventDefault();
    setIsLoading(true);
    setError('');
    setVerificationMessage('');
    setCanResend(false); // 재전송 상태 초기화
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/send-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, isResend: codeSent })
      });
      const data = await response.json();
      if (response.ok) {
        setCodeSent(true);
        setSuccessMessage('인증 코드가 발송되었습니다.');
        setCountdown(60); // 1분 카운트다운 시작
      } else {
        throw new Error(data.message || '인증 코드 발송 실패');
      }
    } catch (error) {
      console.error('인증 코드 발송 에러:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyCode = async () => {
    if (!verificationCode) {
      setError('인증코드를 입력해주세요.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setVerificationMessage('');
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, verificationCode })
      });
      const data = await response.json();
      if (response.ok) {
        setIsVerified(true);
        setSuccessMessage('휴대폰 인증이 완료되었습니다.');
        setCountdown(0); // 카운트다운 중지
      } else {
        throw new Error('인증번호를 다시 확인해주세요');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const findId = async () => {
    if (!isVerified) {
      setError('휴대폰 인증을 완료해주세요.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/find-id`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber })
      });
      const data = await response.json();
      if (response.ok) {
        setFoundId(data.username);
        setSuccessMessage('아이디 찾기에 성공했습니다.');
      } else {
        throw new Error(data.message || '아이디 찾기에 실패했습니다.');
      }
    } catch (error) {
      console.error('아이디 찾기 에러:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 시간 형식 변환 (초 -> mm:ss)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="find-id-modal-overlay">
      <div className="find-id-form-container">
        <button className="find-close-button" onClick={() => navigate('/')}>×</button>
        <div className="signup-header">
          <img src={ICON.LOGO} alt="PRM 로고" className="signup-logo" />
        </div>
        <form className="signup-form">
          <h2>아이디 찾기</h2>
          <div className="input-group2">
            <input
              type="tel"
              id="phoneNumber"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              placeholder="휴대폰 번호"
            />
            <button 
              onClick={sendVerificationCode} 
              disabled={isLoading || (codeSent && !verificationMessage && !canResend)} 
              className="check-button"
            >
              {isLoading ? "발송 중..." : codeSent && canResend ? "재전송" : "코드발송"}
            </button>
          </div>
          
          {verificationMessage && (
            <p style={{ color: '#ff8c00', margin: '5px 0', fontSize: '14px' }}>{verificationMessage}</p>
          )}
          
          {codeSent && (
            <div style={{ width: '100%' }}>
              <div className="input-group2">
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="인증 코드"
                  disabled={isVerified}
                />
                <button 
                  type="button" 
                  onClick={verifyCode} 
                  disabled={isLoading || isVerified} 
                  className="check-button"
                >
                  {isLoading ? "인증 중..." : "인증하기"}
                </button>
              </div>
              
              {countdown > 0 && !isVerified && (
                <div style={{ 
                  textAlign: 'right', 
                  marginTop: '5px', 
                  fontSize: '14px', 
                  color: countdown <= 10 ? '#ff0000' : '#666' 
                }}>
                  <span style={{ 
                    padding: '2px 8px', 
                    borderRadius: '10px', 
                    backgroundColor: countdown <= 10 ? 'rgba(255,0,0,0.1)' : 'rgba(0,0,0,0.05)'
                  }}>
                    {formatTime(countdown)}
                  </span>
                </div>
              )}
              
              {canResend && !isVerified && (
                <p style={{ 
                  color: '#3275F8', 
                  margin: '5px 0 0 0', 
                  fontSize: '14px', 
                  textAlign: 'right' 
                }}>
                  인증시간이 만료되었습니다. 재전송 버튼을 눌러주세요.
                </p>
              )}
            </div>
          )}
          
          {successMessage && (
            <div style={{ 
              backgroundColor: 'rgba(0, 128, 0, 0.1)', 
              padding: '10px', 
              borderRadius: '5px', 
              margin: '10px 0',
              textAlign: 'center'
            }}>
              <p style={{ color: 'green', margin: '0' }}>{successMessage}</p>
            </div>
          )}
          
          {error && (
            <div style={{ 
              backgroundColor: 'rgba(255, 0, 0, 0.1)', 
              padding: '10px', 
              borderRadius: '5px',
              margin: '10px 0',
              textAlign: 'center'
            }}>
              <p style={{ color: 'red', margin: '0' }}>{error}</p>
            </div>
          )}
          
          {isVerified && (
            <div className="verification-success" style={{ marginTop: '10px' }}>
              <button 
                type="button" 
                onClick={findId} 
                className="signup-button"
                disabled={isLoading}
                style={{
                  background: 'linear-gradient(to right, #3275F8, #1C54B2)',
                  boxShadow: '0 2px 8px rgba(50, 117, 248, 0.3)'
                }}
              >
                {isLoading ? "처리 중..." : "아이디 찾기"}
              </button>
            </div>
          )}
          
          {foundId && (
            <div className="result-message" style={{ 
              margin: '20px 0', 
              padding: '15px', 
              textAlign: 'center', 
              backgroundColor: 'rgba(50, 117, 248, 0.1)', 
              borderRadius: '8px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
            }}>
              <p style={{ margin: '0', fontSize: '15px' }}>
                아이디는 <span style={{ color: '#3275F8', fontWeight: 'bold', fontSize: '16px' }}>{foundId}</span> 입니다.
              </p>
            </div>
          )}
          
          <div className="link-container" style={{ marginTop: '20px' }}>
            <p className="login-link-container" style={{ textAlign:'left' }}>
              <Link to="/" className="login-link">로그인페이지 돌아가기</Link>
            </p>
            <p className="login-link-container" style={{ textAlign:'right' }}>
              <Link to="/findPassword" className="login-link">비밀번호 찾기</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FindIdPage;
