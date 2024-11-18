import React from "react";
import styled from "styled-components";
function CustomProgressBar() {
  return (
    <div>
      <ProgressBar></ProgressBar>
    </div>
  );
}

export default CustomProgressBar;

const ProgressBar = styled.div`
  width: ${(props) => (props.step ? `${props.step}%` : "0")};
  height: 100%;
  background: black;
  transition: width 0.5s ease; /* width 변화에 대한 transition 효과 */
`;
