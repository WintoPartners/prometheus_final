import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

function LoadingPage() {

  return (
    <div className="contents">
      <div className="loading-wrap">
        <p className="title">
          GPTs가 분석하는 중..
          <br />
          잠시만 기다려주세요
        </p>

        <div className="loading-bar-wrap">
          <ProgressBar />
        </div>
      </div>
    </div>
  );
}

export default LoadingPage;

const ProgressBar = styled.div`
  height: 20px;
  width: 100%; /* 컨테이너의 전체 너비를 차지하도록 설정 */
  border-radius: 8px;
  background-color: #eee; /* 게이지 배경색 설정 */
  position: relative;
  overflow: hidden; /* 게이지가 컨테이너 바깥으로 나가지 않도록 설정 */

  &:before {
    content: "";
    position: absolute;
    height: 100%;
    width: 20%; /* 게이지의 초기 너비를 설정 */
    background: linear-gradient(90deg, rgba(24, 140, 240, 1) 0%, rgba(4, 2, 253, 1) 100%);
    animation: moveGauge 1.8s linear infinite;
    border-radius:0.5rem;
  }

  @keyframes moveGauge {
    0% { left: -10%; } /* 게이지 시작 위치를 컨테이너 왼쪽 바깥으로 설정 */
    100% { left: 100%; } /* 게이지가 컨테이너 오른쪽 끝까지 이동하도록 설정 */
  }
`;

