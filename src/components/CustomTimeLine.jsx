import React, { useEffect, useState } from "react";
import styled from "styled-components";

// LineItem 컴포넌트 정의 유지
const LineItem = ({ heading, subHeading, currentPercentage, positionX, color }) => {
  return (
    <BarItem positionX={positionX}>
      <ProgressBar currentPercentage={currentPercentage} color={color} />
      <div className="info-text" title={`${heading} ${subHeading}`}>
        <p>{heading}</p>
        <span>{subHeading}</span>
      </div>
    </BarItem>
  );
};

// CustomTimeLine 컴포넌트 수정
function CustomTimeLine({tasks}) {

  const maxMonth = Math.max(...tasks.map(task => task.end_month));
  const months = Array.from({ length: maxMonth }, (_, i) => i + 1);

  return (
    <div className="custom-time-line" >
      <div className="time-line-wrap">
        {months.map(month => (
          <div className="time-line-item" key={month} style={{ flex: `0 0 ${100 / months.length}%` }}>
            <p className="heading">{month}개월</p>
            <div className="time-line-grid">
              {month === 1 ? (
                tasks.map((task, index) => (
                  <div className="time-line-grid__item" key={index}>
                    <LineItem
                      heading={task.task_name}
                      subHeading={task.roles_involved}
                      currentPercentage={(task.end_month - task.start_month) * 100.5} // 실제 값에 기반한 계산 필요
                      positionX={task.start_month * 100.5} // 시작 위치 계산 필요
                      color={task.color}
                    />
                  </div>
                ))
              ) : (
                [...Array(tasks.length)].map((_, index) => (
                  <div className="time-line-grid__item" key={index}></div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CustomTimeLine;
// function calculateTaskProgress(task, month) {
//   let currentPercentage = 0;
//   let positionX = 0;

//   const monthStart = month+1;
//   const monthEnd = month + 1.9999;

//   // 태스크가 해당 월에 아예 포함되지 않는 경우
//   if (month < Math.floor(task.start_month) || month > Math.ceil(task.end_month)) {
//     currentPercentage = 0;
//     positionX = 0;
//   }
//   // 태스크가 해당 월에 시작하는 경우
//   else if (task.start_month <= monthEnd && task.start_month >= monthStart) {
//     if (task.end_month <= monthEnd) {
//       // 해당 월 내에서 태스크가 끝나는 경우
//       currentPercentage = ((task.end_month - task.start_month) * 100).toFixed(2);
//       positionX = ((task.start_month - Math.floor(task.start_month)) * 100).toFixed(2);
//     } else if (task.end_month >= monthEnd) {
//       currentPercentage = ((monthEnd - task.start_month) * 100).toFixed(2);
//       positionX = ((task.start_month + 1 - monthEnd) * 100).toFixed(2);
//     } else {
//       // 해당 월을 넘어서 계속되는 경우
//       currentPercentage = ((monthEnd - task.start_month + 1) * 100).toFixed(2);
//       positionX = ((task.start_month - Math.floor(task.start_month)) * 100).toFixed(2);
//     }
//   }
//   // 태스크가 해당 월에 종료되는 경우
//   else if (task.end_month >= monthStart && task.end_month <= monthEnd) {
//     // 월의 시작부터 태스크가 종료되기까지의 비율 계산
//     if (Math.floor(task.end_month) !== month) { // 태스크 종료가 다음 달의 시작 부분에 걸쳐 있는 경우
//       currentPercentage = (task.end_month + 1 - month) * 100;
//       positionX = 0; // 다음 달 시작이므로, position은 0에서 시작
//     } else {
//       currentPercentage = ((task.end_month % 1) * 100).toFixed(2);
//       positionX = 0;
//     }
//   }
//   else if (task.start_month < monthStart && task.end_month > monthEnd) {
//     currentPercentage = 100;
//     positionX = 0;
//   }

//   return { currentPercentage, positionX };
// }



// 스타일드 컴포넌트 정의 유지
const BarItem = styled.div.withConfig({
  shouldForwardProp: (prop) => !['positionX'].includes(prop),
})`
  width: 100%;
  position: absolute;
  top: 70%;
  left: ${({ positionX }) => positionX ? `${positionX}%` : "0"};
  transform: translate(0, -50%);
  & .info-text {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-left:5px;
    & p, & span {
      white-space: nowrap; // 텍스트를 한 줄로 표시
    }

    & p {
      font-size: 14px;
      font-weight: 600;
      margin-left: 5px;
    }
    & span {
      font-size: 12px;
      color: #777;
    }
`;

const ProgressBar = styled.div.withConfig({
  shouldForwardProp: (prop) => !['currentPercentage'].includes(prop),
})`
  width: ${({ currentPercentage }) => currentPercentage ? `${currentPercentage}%` : "0"};
  height: 5px;
  background: ${({ color }) => color || "#000"};
  transition: width ease;
  border-radius: 4px;
  // 여기에 추가 스타일을 정의할 수 있습니다.
`;
