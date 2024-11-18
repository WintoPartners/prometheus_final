import React, { useState,useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './SuccessPage.css';

const SuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const [responseData, setResponseData] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const billingKey = params.get('billingKey');
    const customerKey = params.get('customerKey');

    if (billingKey && customerKey) {
      fetch(`${process.env.REACT_APP_API_ENDPOINT}/save-billing-key`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ billingKey, customerKey }),
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // 성공 메시지 표시 또는 다른 처리
        } else {
          // 실패 메시지 표시 또는 다른 처리
        }
      })
      .catch(error => console.error('Error saving billing key:', error));
    }
  }, [location]);

  return (
    <div className="success-container">
      <h1>카드 등록 성공</h1>
      <p>카드 등록이 성공적으로 완료되었습니다. 서비스를 이용해 주셔서 감사합니다.</p>
      <button onClick={() => navigate('/init')}>홈으로 이동</button>
    </div>
  );
};

export default SuccessPage;
