import { ICON } from "constant";
import React, { useEffect, useState } from "react";

function CustomSubjectCheckBox({ checkId, imgSrc, workTypeHeading, value, onChange, checked, editable  }) {
  const [isChecked, setIsChecked] = useState(false);
  const [text, setText] = useState(workTypeHeading);
  const displayText = text.length > 8 ? text.substring(0, 7) + '…' : text;
  useEffect(() => {
    // props로 받은 `checked` 값에 변화가 있을 때마다 상태 업데이트
    setIsChecked(checked);
  }, [checked]);
  const checkHandler = ({ target }) => {
    setIsChecked(target.checked);
    onChange(value,target.checked,text);
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
        {editable ? (
          <textarea
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className={`heading-text-box`}
            placeholder="새 기능"
          />
        ) : (
          <p className={`heading-text ${isChecked ? "active" : ""}`}>{displayText}</p>
        )}
      </div>
    </label>
  );
}

export default CustomSubjectCheckBox;
