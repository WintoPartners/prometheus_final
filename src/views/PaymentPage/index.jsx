import React, { useState, useEffect } from 'react';
import './PaymentPage.css';
import { useLocation } from 'react-router-dom';
import { loadTossPayments } from '@tosspayments/payment-sdk';

const clientKey = 'test_ck_Z61JOxRQVE9z9DyGJ5YQVW0X9bAq';

const PaymentPage = () => {
  const { state } = useLocation();
  const { selectedPlan } = state || { selectedPlan: 'free' };
  const [customerKey, setCustomerKey] = useState(null);

  const planDetails = {
    free: { name: '무료 플랜', price: 'free', period: '/계정별 3회' },
    monthly: { name: '단기 플랜', price: '₩4,900', period: '/월' },
    annual: { name: '정기 플랜', price: '₩49,000', period: '/년' },
  };

  useEffect(() => {
    // 서버에서 customerKey 가져오기
    fetch(`${process.env.REACT_APP_API_ENDPOINT}/get-customer-key`, {
      credentials: 'include'  // 쿠키(세션)를 포함시킴
    })
      .then(response => response.json())
      .then(data => setCustomerKey(data.customerKey))
      .catch(error => console.error('Failed to fetch customerKey:', error));
  }, []);

  const plan = planDetails[selectedPlan] || planDetails['free'];
  const [paymentWidget, setPaymentWidget] = useState(null);

  const handleCardRegistration = () => {
    if (!customerKey) {
      console.error('Customer key is not available');
      return;
    }

    loadTossPayments(clientKey).then(tossPayments => {
      tossPayments
        .requestBillingAuth('카드', {
          customerKey: customerKey,
          
          successUrl: `${process.env.REACT_APP_API_ENDPOINT}/success`, // 백엔드 서버 주소 사용
          failUrl: `${process.env.REACT_APP_API_ENDPOINT}/fail`, // 실패 시 리디렉션도 백엔드 주소로 설정
        })
        .catch(function (error) {
          if (error.code === 'USER_CANCEL') {
            console.error('결제 고객이 결제창을 닫았습니다.');
          } else {
            console.error('결제창에서 에러가 발생했습니다:', error);
            window.location.href = '/fail';
          }
        });
    });
  };

  return (
    <div className="payment-container">
      <h2>선택한 요금제</h2>
      <div className="selected-plan">
        <div className="plan-name">{plan.name}</div>
        <div className="plan-price">
          <span className="price">{plan.price}</span>
          <span className="period">{plan.period}</span>
        </div>
      </div>
      <div id="payment-method"></div>
      <div id="agreement"></div>
      <button className="confirm-button" onClick={handleCardRegistration}>카드 등록하기</button>
    </div>
  );
};

export default PaymentPage;
