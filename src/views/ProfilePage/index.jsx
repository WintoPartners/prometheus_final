import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ICON } from "constant";

const PageContainer = styled.div`
  background-color: #1e1e1e;
  color: #fff;
  min-height: 100vh;
  padding: 20px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProfileContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
  padding: 20px;
  background-color: #2c2c2c;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const AvatarContainer = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #3a3a3a;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Avatar = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const AvatarPlaceholder = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  font-size: 48px;
  color: #777;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const Username = styled.h2`
  font-size: 24px;
  margin-bottom: 5px;
  color: #fff;
`;

const Email = styled.p`
  font-size: 16px;
  color: #aaa;
  margin-bottom: 10px;
`;

const JoinDate = styled.p`
  font-size: 14px;
  color: #777;
`;

const ProfileTabs = styled.div`
  display: flex;
  border-bottom: 1px solid #3a3a3a;
  margin-bottom: 20px;
`;

const TabButton = styled.button`
  background: none;
  border: none;
  padding: 10px 20px;
  color: ${props => (props.$active ? '#3275F8' : '#aaa')};
  font-size: 16px;
  font-weight: ${props => (props.$active ? 'bold' : 'normal')};
  cursor: pointer;
  border-bottom: ${props => (props.$active ? '2px solid #3275F8' : 'none')};
  margin-bottom: ${props => (props.$active ? '-1px' : '0')};
  transition: all 0.3s;
  
  &:hover {
    color: #3275F8;
  }
`;

const ProfileCard = styled.div`
  background-color: #2c2c2c;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const CardTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 20px;
  color: #fff;
  border-bottom: 1px solid #3a3a3a;
  padding-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #aaa;
  font-size: 14px;
`;

const Input = styled.input`
  width: 100%;
  max-width: 100%;
  padding: 12px 15px;
  background-color: #3a3a3a;
  border: 1px solid #444;
  border-radius: 6px;
  color: #fff;
  font-size: 16px;
  transition: border-color 0.3s;
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  
  &:focus {
    outline: none;
    border-color: #3275F8;
  }
  
  &::placeholder {
    color: #666;
  }
`;

const Button = styled.button`
  background-color: #3275F8;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 12px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  &:hover {
    background-color: #2260d8;
  }
  
  &:disabled {
    background-color: #555;
    cursor: not-allowed;
  }
`;

const PhoneInputGroup = styled.div`
  display: flex;
  gap: 10px;
  width: 100%;
`;

const VerificationCodeInput = styled(Input)`
  max-width: 200px;
`;

const VerificationButton = styled(Button)`
  background-color: ${props => props.verified ? '#28a745' : '#3275F8'};
  min-width: 120px;
  
  &:hover {
    background-color: ${props => props.verified ? '#218838' : '#2260d8'};
  }
`;

const Timer = styled.div`
  color: #dc3545;
  font-size: 14px;
  margin-top: 5px;
  display: flex;
  align-items: center;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 20px;
`;

const ProposalsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const ProposalCard = styled.div`
  background-color: #333;
  border-radius: 8px;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #3a3a3a;
  }
`;

const ProposalInfo = styled.div`
  flex: 1;
`;

const ProposalTitle = styled.h4`
  margin: 0 0 5px 0;
  font-size: 16px;
  color: #fff;
`;

const ProposalAgency = styled.p`
  margin: 0;
  font-size: 14px;
  color: #aaa;
`;

const ProposalActions = styled.div`
  display: flex;
  gap: 10px;
`;

const DeleteIcon = styled.img`
  width: 20px;
  height: 20px;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.3s;
  
  &:hover {
    opacity: 1;
  }
`;

const Message = styled.p`
  padding: 15px;
  border-radius: 6px;
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  background-color: ${props => (props.type === 'success' ? 'rgba(40, 167, 69, 0.2)' : 'rgba(220, 53, 69, 0.2)')};
  color: ${props => (props.type === 'success' ? '#28a745' : '#dc3545')};
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const PageButton = styled.button`
  padding: 8px 12px;
  margin: 0 5px;
  background-color: ${props => (props.$active ? '#3275F8' : '#3a3a3a')};
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${props => (props.$active ? '#2260d8' : '#444')};
  }
`;

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [activeTab, setActiveTab] = useState('account');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    phone: ''
  });
  
  // 휴대폰 번호 인증 관련 상태
  const [phoneVerification, setPhoneVerification] = useState({
    isVerifying: false,
    verificationCode: '',
    countdown: 0,
    verified: false,
    originalPhone: ''
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/user/profile`, {
          method: 'GET',
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        
        const data = await response.json();
        setUser(data.user);
        setUserData({
          username: data.user.username || '',
          email: data.user.email || '',
          phone: data.user.phone || ''
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        setMessage({ text: '사용자 정보를 불러오는데 실패했습니다.', type: 'error' });
      }
    };
    
    const fetchProposals = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/proposals`, {
          method: 'GET',
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch proposals');
        }
        
        const data = await response.json();
        setProposals(data.proposals || []);
      } catch (error) {
        console.error('Error fetching proposals:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
    fetchProposals();
  }, []);
  
  useEffect(() => {
    // 카운트다운 타이머
    if (phoneVerification.countdown > 0) {
      const timer = setTimeout(() => {
        setPhoneVerification(prev => ({
          ...prev,
          countdown: prev.countdown - 1
        }));
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [phoneVerification.countdown]);
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleUserDataChange = (e) => {
    const { name, value } = e.target;
    
    // 전화번호가 변경되면 인증 상태 초기화
    if (name === 'phone' && value !== phoneVerification.originalPhone) {
      setPhoneVerification(prev => ({
        ...prev,
        verified: false,
        isVerifying: false,
        verificationCode: '',
        countdown: 0
      }));
    }
    
    setUserData(prev => ({ ...prev, [name]: value }));
  };
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // 인증코드 요청
  const requestVerificationCode = async () => {
    // 휴대폰 번호 유효성 검사
    const phoneRegex = /^010\d{8}$/;
    if (!phoneRegex.test(userData.phone)) {
      setMessage({ text: '올바른 휴대폰 번호 형식이 아닙니다. (010으로 시작하는 11자리)', type: 'error' });
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/send-code`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phoneNumber: userData.phone,
          isResend: phoneVerification.isVerifying,
          isProfileUpdate: true
        })
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || '인증코드 발송에 실패했습니다.');
      }
      
      const data = await response.json();
      
      setPhoneVerification(prev => ({
        ...prev,
        isVerifying: true,
        countdown: data.expiresIn || 60,
        originalPhone: userData.phone
      }));
      
      setMessage({ text: '인증코드가 발송되었습니다.', type: 'success' });
    } catch (error) {
      console.error('Error sending verification code:', error);
      setMessage({ text: error.message || '인증코드 발송에 실패했습니다.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };
  
  // 인증코드 확인
  const verifyCode = async () => {
    if (!phoneVerification.verificationCode) {
      setMessage({ text: '인증코드를 입력해주세요.', type: 'error' });
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/verify-code`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phoneNumber: userData.phone,
          verificationCode: phoneVerification.verificationCode,
          isProfileUpdate: true
        })
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || '인증에 실패했습니다.');
      }
      
      const data = await response.json();
      
      if (data.verified) {
        setPhoneVerification(prev => ({
          ...prev,
          verified: true,
          isVerifying: false,
          countdown: 0
        }));
        setMessage({ text: '휴대폰 번호 인증이 완료되었습니다.', type: 'success' });
      } else {
        throw new Error('인증코드가 일치하지 않습니다.');
      }
    } catch (error) {
      console.error('Error verifying code:', error);
      setMessage({ text: error.message || '인증에 실패했습니다.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };
  
  // 인증코드 입력 처리
  const handleVerificationCodeChange = (e) => {
    setPhoneVerification(prev => ({
      ...prev,
      verificationCode: e.target.value
    }));
  };
  
  const saveProfile = async () => {
    // 이메일 유효성 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (userData.email && !emailRegex.test(userData.email)) {
      setMessage({ text: '올바른 이메일 형식이 아닙니다.', type: 'error' });
      return;
    }
    
    // 휴대폰 번호가 변경되었는데 인증이 안 된 경우
    const phoneChanged = user?.phone !== userData.phone;
    if (phoneChanged && !phoneVerification.verified) {
      setMessage({ text: '휴대폰 번호 변경 시 인증이 필요합니다.', type: 'error' });
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/user/update`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...userData,
          phoneVerified: phoneVerification.verified
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      const data = await response.json();
      setMessage({ text: '프로필 정보가 업데이트되었습니다.', type: 'success' });
      
      // 업데이트된 유저 정보 반영
      setUser(data.user || { ...user, ...userData });
      
      // 인증 상태 초기화
      if (phoneVerification.verified) {
        setPhoneVerification(prev => ({
          ...prev,
          verified: false,
          isVerifying: false,
          verificationCode: '',
          countdown: 0,
          originalPhone: userData.phone
        }));
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ text: '프로필 업데이트에 실패했습니다.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };
  
  const updatePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ text: '새 비밀번호가 일치하지 않습니다.', type: 'error' });
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/user/password`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update password');
      }
      
      setMessage({ text: '비밀번호가 변경되었습니다.', type: 'success' });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error updating password:', error);
      setMessage({ text: error.message || '비밀번호 변경에 실패했습니다.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteProposal = async (id, e) => {
    e.stopPropagation(); // 카드 클릭 이벤트 전파 방지
    
    if (window.confirm('해당 제안서를 삭제하시겠습니까?')) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/deleteProposal`, {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id })
        });

        if (response.ok) {
          setProposals(proposals.filter(proposal => proposal.id !== id));
          setMessage({ text: '제안서가 삭제되었습니다.', type: 'success' });
        } else {
          throw new Error('Failed to delete the proposal');
        }
      } catch (error) {
        console.error('Error:', error);
        setMessage({ text: '제안서 삭제에 실패했습니다.', type: 'error' });
      }
    }
  };
  
  const viewProposal = (id) => {
    navigate(`/profileDetail/${id}`);
  };
  
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [message]);
  
  // 페이징 로직
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProposals = proposals.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(proposals.length / itemsPerPage);
  
  const handlePageClick = (number) => {
    setCurrentPage(number);
  };

  if (loading && !user) {
    return (
      <PageContainer>
        <div style={{ marginTop: '100px', textAlign: 'center' }}>
          <p>로딩 중...</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <ProfileContainer>
        <ProfileHeader>
          {/* <AvatarContainer>
            {user?.avatar ? (
              <Avatar src={user.avatar} alt="프로필 사진" />
            ) : (
              <AvatarPlaceholder>
                {user?.username ? user.username.charAt(0).toUpperCase() : '?'}
              </AvatarPlaceholder>
            )}
          </AvatarContainer> */}
          
          <UserInfo>
            <Username>{user?.username || '사용자'}</Username>
            <Email>{user?.email || 'email@example.com'}</Email>
            <JoinDate>가입일: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '정보 없음'}</JoinDate>
          </UserInfo>
        </ProfileHeader>
        
        {message.text && (
          <Message type={message.type}>{message.text}</Message>
        )}
        
        <ProfileTabs>
          <TabButton 
            $active={activeTab === 'account'} 
            onClick={() => handleTabChange('account')}
          >
            계정 정보
          </TabButton>
          <TabButton 
            $active={activeTab === 'password'} 
            onClick={() => handleTabChange('password')}
          >
            비밀번호 변경
          </TabButton>
          <TabButton 
            $active={activeTab === 'proposals'} 
            onClick={() => handleTabChange('proposals')}
          >
            내 제안서
          </TabButton>
        </ProfileTabs>
        
        {activeTab === 'account' && (
          <ProfileCard>
            <CardTitle>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15C15.3137 15 18 12.3137 18 9C18 5.68629 15.3137 3 12 3C8.68629 3 6 5.68629 6 9C6 12.3137 8.68629 15 12 15Z" stroke="#3275F8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2.90625 20.2491C3.82772 18.6531 5.1537 17.3278 6.74966 16.407C8.34562 15.4863 10.1568 15 12.0002 15C13.8436 15 15.6548 15.4863 17.2508 16.407C18.8467 17.3278 20.1727 18.6531 21.0942 20.2491" stroke="#3275F8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              개인 정보
            </CardTitle>
            
            <FormGroup>
              <Label htmlFor="username">아이디</Label>
              <Input
                type="text"
                id="username"
                name="username"
                value={userData.username}
                onChange={handleUserDataChange}
                placeholder="아이디를 입력하세요"
                disabled
              />
              <p style={{ fontSize: '12px', color: '#aaa', marginTop: '5px' }}>
                아이디는 변경할 수 없습니다.
              </p>
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="email">이메일</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={userData.email}
                onChange={handleUserDataChange}
                placeholder="이메일을 입력하세요"
                disabled={user?.loginType !== 'local'} // 소셜 로그인 사용자는 이메일 변경 불가
              />
              {user?.loginType !== 'local' && (
                <p style={{ fontSize: '12px', color: '#aaa', marginTop: '5px' }}>
                  소셜 로그인 사용자는 이메일을 변경할 수 없습니다.
                </p>
              )}
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="phone">휴대폰 번호</Label>
              <PhoneInputGroup>
                <Input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={userData.phone}
                  onChange={handleUserDataChange}
                  placeholder="휴대폰 번호를 입력하세요 (- 없이 입력)"
                />
                <VerificationButton 
                  onClick={requestVerificationCode}
                  disabled={loading || phoneVerification.verified}
                  verified={phoneVerification.verified}
                >
                  {phoneVerification.verified ? '인증완료' : (phoneVerification.isVerifying ? '재전송' : '인증요청')}
                </VerificationButton>
              </PhoneInputGroup>
              {phoneVerification.isVerifying && (
                <>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px', alignItems: 'center' }}>
                    <VerificationCodeInput
                      type="text"
                      placeholder="인증번호 입력"
                      value={phoneVerification.verificationCode}
                      onChange={handleVerificationCodeChange}
                    />
                    <Button 
                      onClick={verifyCode}
                      disabled={loading || phoneVerification.verificationCode.length < 4}
                    >
                      확인
                    </Button>
                    {phoneVerification.countdown > 0 && (
                      <Timer>
                        {Math.floor(phoneVerification.countdown / 60)}:{(phoneVerification.countdown % 60).toString().padStart(2, '0')}
                      </Timer>
                    )}
                  </div>
                </>
              )}
              <p style={{ fontSize: '12px', color: '#aaa', marginTop: '5px' }}>
                휴대폰 번호 변경 시 인증이 필요합니다.
              </p>
            </FormGroup>
            
            <ButtonGroup>
              <Button 
                onClick={saveProfile} 
                disabled={loading || (user?.phone !== userData.phone && !phoneVerification.verified)}
              >
                {loading ? '저장 중...' : '저장하기'}
              </Button>
            </ButtonGroup>
          </ProfileCard>
        )}
        
        {activeTab === 'password' && (
          <ProfileCard>
            <CardTitle>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 10V8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8V10" stroke="#3275F8" strokeWidth="2" strokeLinecap="round"/>
                <path d="M5 10H19V20C19 20.5523 18.5523 21 18 21H6C5.44772 21 5 20.5523 5 20V10Z" stroke="#3275F8" strokeWidth="2"/>
                <path d="M12 16V17" stroke="#3275F8" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              비밀번호 변경
            </CardTitle>
            
            {user?.loginType !== 'local' ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <p>소셜 로그인 사용자는 비밀번호를 변경할 수 없습니다.</p>
                <p style={{ fontSize: '14px', color: '#aaa', marginTop: '10px' }}>
                  로그인 방식: {user?.loginType}
                </p>
              </div>
            ) : (
              <>
                <FormGroup>
                  <Label htmlFor="currentPassword">현재 비밀번호</Label>
                  <Input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="현재 비밀번호를 입력하세요"
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="newPassword">새 비밀번호</Label>
                  <Input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="새 비밀번호를 입력하세요"
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="confirmPassword">새 비밀번호 확인</Label>
                  <Input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="새 비밀번호를 다시 입력하세요"
                  />
                </FormGroup>
                
                <ButtonGroup>
                  <Button onClick={updatePassword} disabled={loading}>
                    {loading ? '처리 중...' : '비밀번호 변경'}
                  </Button>
                </ButtonGroup>
              </>
            )}
          </ProfileCard>
        )}
        
        {activeTab === 'proposals' && (
          <ProfileCard>
            <CardTitle>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 2V5" stroke="#3275F8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 2V5" stroke="#3275F8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 7.5H21" stroke="#3275F8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19.5 4H4.5C3.67157 4 3 4.67157 3 5.5V19.5C3 20.3284 3.67157 21 4.5 21H19.5C20.3284 21 21 20.3284 21 19.5V5.5C21 4.67157 20.3284 4 19.5 4Z" stroke="#3275F8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 11H8.01" stroke="#3275F8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 11H12.01" stroke="#3275F8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 11H16.01" stroke="#3275F8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 15H8.01" stroke="#3275F8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 15H12.01" stroke="#3275F8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 15H16.01" stroke="#3275F8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              내 제안서 목록
            </CardTitle>
            
            {currentProposals.length > 0 ? (
              <ProposalsList>
                {currentProposals.map(proposal => (
                  <ProposalCard 
                    key={proposal.id} 
                    onClick={() => viewProposal(proposal.id)}
                  >
                    <ProposalInfo>
                      <ProposalTitle>{proposal.title}</ProposalTitle>
                      <ProposalAgency>{proposal.agency} | {proposal.period} | {proposal.budget}만원</ProposalAgency>
                    </ProposalInfo>
                    <ProposalActions>
                      <DeleteIcon 
                        src={ICON.CANCEL} 
                        alt="삭제" 
                        onClick={(e) => handleDeleteProposal(proposal.id, e)}
                      />
                    </ProposalActions>
                  </ProposalCard>
                ))}
              </ProposalsList>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0', color: '#aaa' }}>
                생성한 제안서가 없습니다.
              </div>
            )}
            
            {totalPages > 1 && (
              <Pagination>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                  <PageButton
                    key={number}
                    $active={currentPage === number}
                    onClick={() => handlePageClick(number)}
                  >
                    {number}
                  </PageButton>
                ))}
              </Pagination>
            )}
          </ProfileCard>
        )}
      </ProfileContainer>
    </PageContainer>
  );
}

export default ProfilePage;
