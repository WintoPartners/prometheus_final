// FailPage.js
import React from 'react';
import { useLocation } from 'react-router-dom';

function FailPage() {
    const location = useLocation();
    const { message } = location.state; // 실패 정보

    return (
        <div>
            <h1>결제 실패</h1>
            <p>에러 메시지: {message}</p>
            <a href="/subscription">홈으로 돌아가기</a>
        </div>
    );
}

export default FailPage;
