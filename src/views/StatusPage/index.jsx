import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ICON } from 'constant';

const StatusPage = () => {
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/subscription`, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        console.log('Fetched subscription data:', data);
        if (response.ok) {
          setSubscriptionData(data);
        } else {
          console.error('Failed to fetch subscription data:', data.message);
        }
      } catch (error) {
        console.error('Error fetching subscription data:', error);
      }
    };

    const fetchPaymentHistory = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/payment-history`, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        console.log('Fetched payment history:', data);
        if (response.ok) {
          setPaymentHistory(data);
        } else {
          console.error('Failed to fetch payment history:', data.message);
        }
      } catch (error) {
        console.error('Error fetching payment history:', error);
      }
    };

    fetchSubscriptionData();
    fetchPaymentHistory();
  }, []);

  if (!subscriptionData) {
    return <Loading>Loading...</Loading>;
  }

  const { subscription_status, subscription_start_date, subscription_end_date, available_num } = subscriptionData;

  console.log('Subscription status:', subscription_status);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  let planName;
  let planDetails;
  let paymentDetails;

  switch (Number(subscription_status)) {
    case 1:
      planName = '건별 플랜';
      planDetails = (
        <Details>
          <DetailItem>이용 가능 횟수 : {available_num}</DetailItem>
        </Details>
      );
      paymentDetails = <DetailItem>₩990/3회</DetailItem>;
      break;
    case 2:
      planName = '단기 플랜';
      planDetails = (
        <Details>
          <DetailItem>이용 기간 : {formatDate(subscription_start_date)} ~ {formatDate(subscription_end_date)}</DetailItem>
          <DetailItem>이용 횟수 : 무제한</DetailItem>
        </Details>
      );
      paymentDetails = <DetailItem>₩4900/월</DetailItem>;
      break;
    case 3:
      planName = '정기 플랜';
      planDetails = (
        <Details>
          <DetailItem>이용 기간 : {formatDate(subscription_start_date)} ~ {formatDate(subscription_end_date)}</DetailItem>
          <DetailItem>이용 횟수 : 무제한</DetailItem>
        </Details>
      );
      paymentDetails = <DetailItem>₩49000/년</DetailItem>;
      break;
    default:
      planName = '구독 정보 없음';
      planDetails = <Details><DetailItem>구독 정보를 확인할 수 없습니다.</DetailItem></Details>;
      paymentDetails = <DetailItem>결제중인 요금제가 없습니다.</DetailItem>;
  }

  return (
    <Container>
      <Title>구독 관리</Title>
      <PlanHeader>구독중 요금제</PlanHeader>
      <PlanContainer>
        <PlanTitle>{planName}</PlanTitle>
        {planDetails}
        <CancelSubscriptionButton>구독 취소</CancelSubscriptionButton>
      </PlanContainer>
      <PaymentInfoHeader>구독 결제 정보</PaymentInfoHeader>
      <PaymentInfoContainer>
        {paymentDetails}
        <DetailItem> <CardIcon src={ICON.CARD} alt="카드 아이콘" />5384-****-****-1234</DetailItem>
        <ChangePaymentMethodButton>결제 수단 변경</ChangePaymentMethodButton>
        <Divider />
        <DetailItem>다음 결제일 : {formatDate(subscription_end_date)}</DetailItem>
      </PaymentInfoContainer>
      <PaymentHistoryHeader>결제 내역</PaymentHistoryHeader>
      <RefundButton>환불하기</RefundButton>
      <PaymentHistoryTable>
        <thead>
          <tr>
            <th>날짜</th>
            <th>요금제</th>
            <th>결제 금액</th>
            <th>결제 수단</th>
            <th>상태</th>
            <th>영수증</th>
          </tr>
        </thead>
        <tbody>
          {paymentHistory.length === 0 ? (
            <tr>
              <td colSpan="6" style={{textAlign: 'center'}}>결제 내역이 존재하지 않습니다.</td>
            </tr>
          ) : (
            paymentHistory.map((payment, index) => (
              <tr key={index}>
                <td>{formatDate(payment.date)}</td>
                <td>{payment.plan}</td>
                <td>₩{payment.amount}</td>
                <td>{payment.method}</td>
                <td>{payment.status}</td>
                <td><a href={payment.receiptUrl} target="_blank" rel="noopener noreferrer">보기</a></td>
              </tr>
            ))
          )}
        </tbody>
      </PaymentHistoryTable>
    </Container>
  );
};

export default StatusPage;

const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Loading = styled.div`
  text-align: center;
  margin-top: 50px;
  font-size: 18px;
  color: #666;
`;

const Title = styled.h1`
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
`;

const PlanHeader = styled.h2`
  font-size: 20px;
  color: #333;
  margin-bottom: 10px;
  margin-left: 10px;
  text-align: left; // 왼쪽 정렬
`;

const PlanContainer = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative; // relative positioning for child absolute positioning
  margin-bottom: 20px; // 하단 간격 추가
`;

const PlanTitle = styled.h3`
  font-size: 18px;
  color: #333;
  margin-bottom: 10px;
`;

const Details = styled.div`
  font-size: 16px;
  color: #333;
`;

const DetailItem = styled.p`
  margin: 5px 0;
  color: #333;
`;

const CancelSubscriptionButton = styled.button`
  background: none;
  border: none;
  color: #4a4a4a; // 진한 회색
  cursor: pointer;
  text-decoration: underline;
  font-size: 14px;
  padding: 0;
  position: absolute; // absolute positioning
  bottom: 20px; // position it at the bottom
  right: 20px; // position it at the right

  &:hover {
    color: #333;
  }
`;

const CardIcon = styled.img`
  width: 20px; // 아이콘의 너비 설정
  height: auto; // 아이콘의 높이를 자동으로 설정
  margin-right: 10px; // 아이콘과 텍스트 간의 간격 설정
  vertical-align: middle; // 텍스트와 수직으로 정렬
`;


const PaymentInfoHeader = styled.h2`
  font-size: 20px;
  color: #333;
  margin-bottom: 10px;
  margin-left: 10px;
  text-align: left; // 왼쪽 정렬
`;

const PaymentInfoContainer = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px; // 하단 간격 추가
`;

const ChangePaymentMethodButton = styled.button`
  background: none;
  border: none;
  color: #4a4a4a; // 진한 회색
  cursor: pointer;
  text-decoration: underline;
  font-size: 14px;
  padding: 0;
  float: right; // 오른쪽 정렬

  &:hover {
    color: #333;
  }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e0e0e0;
  margin: 30px 0;
`;

const PaymentHistoryHeader = styled.h2`
  font-size: 20px;
  color: #333;
  margin-bottom: 10px;
  margin-left: 10px;
  text-align: left; // 왼쪽 정렬
`;

const RefundButton = styled.button`
  background: none;
  border: none;
  color: #4a4a4a; // 진한 회색
  cursor: pointer;
  text-decoration: underline;
  font-size: 14px;
  display: block; // 새 줄에 표시
  float: right;

  &:hover {
    color: #333;
  }
`;

const PaymentHistoryTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 40px; // 상단 간격 추가
  margin-bottom: 20px;

  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
    color: #666; // 컬럼 글씨 회색
  }

  th {
    background-color: #f2f2f2;
    font-weight: bold;
  }

  td a {
    color: #007bff;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;
