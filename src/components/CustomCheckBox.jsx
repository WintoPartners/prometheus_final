import { ICON } from "constant";
import React, { useState, useEffect } from "react";

function CustomCheckBox({ checkId, imgSrc, workType, workTypeHeading, checked, onChange }) {
  const [isChecked, setIsChecked] = useState(checked || false);
  
  // checked prop이 변경될 때 내부 상태도 업데이트
  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  const checkHandler = ({ target }) => {
    setIsChecked(target.checked);
    if (onChange) {
      onChange({ target });
    }
  };

  return (
    <label htmlFor={checkId} className={`checkbox-label ${isChecked ? "checked" : ""}`}>
      <input 
        type="checkbox" 
        id={checkId} 
        checked={isChecked}
        onChange={checkHandler}
      />

      <div className={`custom-check ${isChecked ? "active" : ""}`}>
        <img src={ICON.INPUT_CHECK} alt="input checked icon" />
      </div>

      <div className={`work-type ${workType} ${isChecked ? "active" : ""}`}>
        <img src={imgSrc} alt={`${workTypeHeading} 아이콘`} />
      </div>

      <div className="work-type-heading">
        <p className={`heading-text ${isChecked ? "active" : ""}`}>{workTypeHeading}</p>
      </div>
    </label>
  );
}

export default CustomCheckBox;
