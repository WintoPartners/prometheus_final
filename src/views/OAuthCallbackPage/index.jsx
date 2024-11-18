import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function OAuthCallback() {
    const navigate = useNavigate();

    useEffect(() => {
        // URL에서 인증 코드(code) 추출
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        if (!code) {
            console.error('인증 코드가 URL에 없습니다.');
            window.location.href=`${process.env.REACT_APP_PAGE}/`;
            return;
        }

        // 인증 코드를 서버로 전송하여 처리
        fetch(`${process.env.REACT_APP_API_ENDPOINT}/kakao/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ code })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('로그인 성공:', data);
                window.localStorage.setItem('kakao_token', data.access_token);
                window.location.href=`${process.env.REACT_APP_PAGE}/init`;
            } else {
                console.error('로그인 실패:', data.message);
                window.location.href=`${process.env.REACT_APP_PAGE}/`;
            }
        })
        .catch(error => {
            console.error('서버와의 통신 오류:', error);
            window.location.href=`${process.env.REACT_APP_PAGE}/`;
        });
    }, [navigate]);

    return (
        <div>Loading...</div>
    );
}

export default OAuthCallback;
