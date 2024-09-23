import React, { useState, useEffect } from 'react';
import './SubscriptionPage.css';
import { ICON } from "constant"; // 추가된 import
import { useNavigate } from 'react-router-dom';

const SubscriptionPage = () => {
  const [selectedPlan, setSelectedPlan] = useState('');
  const [subscriptionNew, setSubscriptionNew] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/subscriptionNew`, {
          method: 'GET',
          credentials: 'include'
        });
        const data = await response.json();
        if (response.ok) {
          setSubscriptionNew(data.subscription_new);
        } else {
          throw new Error('Error fetching subscription status error');
        }
      } catch (error) {
        console.error('Error fetching subscription status:', error);
      }
    };

    fetchSubscriptionStatus();
  }, []);

  const handlePlanChange = (event) => {
    setSelectedPlan(event.target.value);
  };

  const handleSubscribe = () => {
    if (!selectedPlan) {
      alert('구독 플랜을 선택해주세요.');
      return;
    }
    // 구독 처리 로직 추가
    navigate('/payment', { state: { selectedPlan } });
  };

  return (
    <div className="subscription-container">
      <h1>구독 플랜 선택</h1>
      <p className="subtitle">누구보다 빠르게 정보를 소화하고 경쟁력을 키워보세요</p>
      <div className="plans">
          <div className={`plan ${selectedPlan === 'free' ? 'selected' : ''}${subscriptionNew === 'Y' ? 'disabled' : ''}`}>
            <input 
              type="radio" 
              id="free" 
              name="plan" 
              value="free" 
              checked={selectedPlan === 'free'} 
              onChange={handlePlanChange} 
              disabled={subscriptionNew === 'Y'}
            />
            <label htmlFor="free">
              <h2>무료 플랜</h2>
              <p className="subheader">누구나 무제한으로 정보를 요약할 수 있습니다.</p>
              <p className="price">free<span className="period">/계정별 3회</span></p>
              <div className="features">
                <p><img src={ICON.CHECK} alt="check" /> 3회 이용가능</p>
                <p><img src={ICON.CHECK} alt="check" /> 파일 업로드</p>
                <p><img src={ICON.CHECK} alt="check" /> 역제안서 생성</p>
              </div>
              {subscriptionNew === 'Y' && <p className="disabled-message">이미 사용된 무료 플랜입니다.</p>}
            </label>
          </div>
        <div className={`plan ${selectedPlan === 'monthly' ? 'selected' : ''}`}>
          <input 
            type="radio" 
            id="monthly" 
            name="plan" 
            value="monthly" 
            checked={selectedPlan === 'monthly'} 
            onChange={handlePlanChange} 
          />
          <label htmlFor="monthly">
            <h2>단기 플랜</h2>
            <p className="subheader">더 빠른 속도를 원하는 개인 사용자에게 적합합니다.</p>
            <p className="price">₩4900<span className="period">/월</span></p>
            <div className="features">
              <p><img src={ICON.CHECK} alt="check" /> 한달간 이용</p>
              <p><img src={ICON.CHECK} alt="check" /> 무제한 생성</p>
              <p><img src={ICON.CHECK} alt="check" /> 파일 업로드</p>
              <p><img src={ICON.CHECK} alt="check" /> 역제안서 생성</p>
            </div>
          </label>
        </div>
        <div className={`plan ${selectedPlan === 'annual' ? 'selected' : ''}`}>
          <input 
            type="radio" 
            id="annual" 
            name="plan" 
            value="annual" 
            checked={selectedPlan === 'annual'} 
            onChange={handlePlanChange} 
          />
          <label htmlFor="annual">
            <h2>정기 플랜</h2>
            <p className="subheader">업무용으로 더 많이 활용하는 사용자에게 적합합니다.</p>
            <p className="price">₩49000<span className="period">/년</span></p>
            <div className="features">
              <p><img src={ICON.CHECK} alt="check" /> 1년간 이용</p>
              <p><img src={ICON.CHECK} alt="check" /> 무제한 생성</p>
              <p><img src={ICON.CHECK} alt="check" /> 파일 업로드</p>
              <p><img src={ICON.CHECK} alt="check" /> 역제안서 생성</p>
            </div>
          </label>
        </div>
      </div>
      <button onClick={handleSubscribe} className="subscribe-button">구독하기</button>
    </div>
  );
};

export default SubscriptionPage;
