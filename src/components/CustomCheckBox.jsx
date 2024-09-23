import { ICON } from "constant";
import React, { useState } from "react";

function CustomCheckBox({ checkId, imgSrc, workType, workTypeHeading, checked, onChange }) {
  const [isChecked, setIsChecked] = useState(false);
  const checkHandler = ({ target }) => {
    setIsChecked(target.checked);
  };

  return (
    <label htmlFor={checkId} className={`checkbox-label ${checked ? "checked" : ""}`}>
      <input 
        type="checkbox" 
        id={checkId} 
        checked={checked} // 부모 컴포넌트에서 전달받은 checked prop 사용
        onChange={onChange} // 부모 컴포넌트에서 전달받은 onChange prop 사용
      />

      <div className={`custom-check ${isChecked ? "active" : ""}`}>
        <img src={ICON.INPUT_CHECK} alt="input checked icon" />
      </div>

      <div className={`work-type ${workType} `}>
        <img src={imgSrc} alt={`${workTypeHeading} 아이콘`} />
      </div>

      <div className="work-type-heading">
        <p className={`heading-text ${isChecked ? "active" : ""}`}>{workTypeHeading}</p>
      </div>
    </label>
  );
}

export default CustomCheckBox;
