import { ICON } from "constant";
import React, {  useState } from "react";

function CustomSubjeectCheckBox({ checkId, imgSrc, workTypeHeading }) {
  const [isChecked, setIsChecked] = useState(false);
  const checkHandler = ({ target }) => {
    setIsChecked(target.checked);
  };
  return (
    <label htmlFor={checkId} className={`checkbox-label ${isChecked ? "checked" : ""}`}>
      <input type="checkbox" id={checkId} checked={isChecked} onChange={checkHandler} />

      <div className={`custom-check ${isChecked ? "active" : ""}`}>
        <img src={ICON.INPUT_CHECK} alt="input checked icon" />
      </div>

      <div className={`work-type ${isChecked ? "active" : ""}`}>
        <img src={imgSrc} alt={`${workTypeHeading} 아이콘`} />
      </div>

      <div className="work-type-heading">
        <p className={`heading-text ${isChecked ? "active" : ""}`}>{workTypeHeading}</p>
      </div>
    </label>
  );
}

export default CustomSubjeectCheckBox;
