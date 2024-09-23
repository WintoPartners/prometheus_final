import React, { useState, useEffect, useRef } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ICON } from "constant";

const StepperLayout = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const menuRef = useRef(); // 드롭다운 메뉴를 위한 ref

  const handleMouseEnter = () => {
    setIsMenuOpen(true);
  };

  const handleMouseLeave = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init('e42a4789fd64d1bf0e771564a7dfe338');  // 카카오 개발자 콘솔에서 발급받은 JavaScript 키
    }
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('kakao_token', token);
    }
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false); // 메뉴 외부 클릭 시 메뉴 닫기
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const isAuthPage = location.pathname === '/' || location.pathname === '/signup' || location.pathname === '/findId' || location.pathname === '/findPassword';
  const initPage = location.pathname === '/init';
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('kakao_token');
      if (window.Kakao && token) {
        window.Kakao.Auth.setAccessToken(token);

        console.log("Current Kakao Access Token:", window.Kakao.Auth.getAccessToken());

        await new Promise((resolve, reject) => {
          window.Kakao.API.request({
            url: '/v1/user/unlink',
            success: () => {
              console.log("카카오 계정 연결 끊기 성공");
              localStorage.removeItem('kakao_token');  // 로그아웃 후 토큰 삭제
              resolve();
            },
            fail: (error) => {
              console.error("카카오 계정 연결 끊기 실패:", error);
              reject(error);
            },
          });
        });
      } else {
        console.error("카카오 액세스 토큰이 유효하지 않음.");
      }

      const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/logout`, { method: 'POST', credentials: 'include' });
      const data = await response.json();
      if (response.ok) {
        console.log(data.message); // "Logout successful"
        navigate('/');
      } else {
        throw new Error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };



  const handleProfileClick = () => {
    navigate('/profile'); // '/profile' 경로로 이동
  };

  const handleSubscribeClick = () => {
    navigate('/status'); // '/status' 경로로 이동
  };
  
  const handleLogoClick = () => {
    // 로그인, 회원가입, ID/PW 찾기 페이지에서 로고 클릭 시 /login으로 이동
    if (isAuthPage) {
      window.location.href = '/';
    } else {
      window.location.href = '/init';
    }
  };

  return (
    <div className="container safe-area">
      <div className="page">
        <div className="layout stepper-page">
          <main id="main" className={initPage ? "init-page-main" : "main"}>
            <LOGO onClick={handleLogoClick}>
              <img src={ICON.LOGO} alt="로고" />
            </LOGO>
            {!isAuthPage && (
              <UserMenu
                ref={menuRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <UserIcon>
                  <img src={ICON.PROFILE} alt="User Menu" />
                </UserIcon>
                {isMenuOpen && (
                  <DropdownMenu>
                    <MenuItem onClick={handleProfileClick}>
                      <MenuIcon src={ICON.FILE_DESCRIPTION} alt="마이페이지 아이콘" />
                      마이페이지
                    </MenuItem>
                    <MenuItem onClick={handleSubscribeClick}>
                      <MenuIcon src={ICON.WALLET} alt="구독 관리 아이콘" />
                      구독 관리
                    </MenuItem>
                    <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
                  </DropdownMenu>
                )}
              </UserMenu>
            )}
            <section className="contents-wrap">
              <Outlet />
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default StepperLayout;

const LOGO = styled.div`
  position: fixed;
  top: 20px;
  left: 40px;
  z-index: 1000;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  & img {
    width: 8rem;
    height: auto;
  }
`;

const UserMenu = styled.div`
  position: fixed;
  top: 20px;
  right: 40px;
  z-index: 1050;
`;

const UserIcon = styled.div`
  cursor: pointer;
  width: 50px;
  height: 50px;
  border-radius: 50%; // 원형으로 만들기
  overflow: hidden; // 둥근 모서리가 잘리도록 하기
  display: flex;
  align-items: center;
  justify-content: center;

  & img {
    width: 100%;
    height: 100%;
    object-fit: cover; // 이미지가 부모 요소에 맞게 잘림
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  right: 0;
  background-color: white;
  color: black;
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
  border-radius: 3px;
  width: 200px;
  overflow: hidden; // 둥근 모서리를 위해 추가
  font-family: 'Arial', sans-serif; // 모던 폰트 사용

  & a {
    color: black; // 링크 색상 설정
    text-decoration: none; // 밑줄 제거
  }
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  padding: 15px 20px; // 메뉴 항목의 높이를 늘리기 위해 패딩 조정
  transition: background-color 0.3s, color 0.3s; // 부드러운 전환 효과
  font-size: 14px; // 폰트 크기 조정
  color: #000;
  cursor: pointer;
  
  &:hover {
    background-color: #f1f1f1; // 호버 배경색
    color: #000; // 호버 텍스트 색상
  }
`;

const MenuIcon = styled.img`
  margin-right: 10px; // 아이콘과 텍스트 간의 간격 조정
  width: 20px; // 아이콘 크기 조정
  height: 20px; // 아이콘 크기 조정
`;

const LogoutButton = styled.button`
  width: calc(100% - 30px); // 버튼 크기 조정
  margin: 20px auto;
  display: block; // 가운데 정렬을 위해 추가
  padding: 10px 0;
  background-color: white; /* 버튼 내부 색상을 흰색으로 설정 */
  border: 1px solid #007bff; /* 외곽선을 현재 색상으로 설정 */
  border-radius: 3px;
  color: #007bff; /* 텍스트 색상을 외곽선 색상과 동일하게 설정 */
  font-size: 12px;
  cursor: pointer;
  text-align: center;
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    background-color: #007bff; /* 호버 시 배경색 변경 */
    color: white; /* 호버 시 텍스트 색상 변경 */
  }
`;
