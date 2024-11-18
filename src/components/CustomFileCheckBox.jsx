import { ICON } from "constant";
import React, { useState } from "react";

function CustomFileCheckBox({ fileInfo }) {
  const [isChecked, setIsChecked] = useState(true);

  const fileSize = fileInfo ? (fileInfo.size / 1024).toFixed(2) + "KB" : "";

  const fileExtension = fileInfo ? fileInfo.name.split('.').pop() : "";

  return (
    <label htmlFor={fileInfo?.checkId} className={`checkbox-label file-upload-list ${isChecked ? "checked" : ""}`}>
    <input type="checkbox" id={fileInfo?.checkId}/>
    <div className="file-item-left">
      <div className="file-icon">
        <img src={ICON.FILE_DEFAULT} alt="file icon" />
        <span className="file-type">{fileExtension}</span>
        </div>
        <div className="file-info">

        <p className="file-name">{fileInfo ? fileInfo.name : "file name.mp3"}</p>
          <p className="file-size">{fileSize}</p>
        </div>
      </div>
      </label>
  );
}

export default CustomFileCheckBox;
