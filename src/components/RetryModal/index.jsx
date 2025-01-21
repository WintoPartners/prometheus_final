import React from 'react';
import './styles.css';

const RetryModal = ({ isOpen, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onConfirm}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="browser-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
        
        <div className="modal-body">
          <div className="ai-icon">🤖</div>
          <h2>잠시만 기다려주세요!</h2>
          <p>더 나은 결과를 위해 AI가<br />다시 한 번 분석하겠습니다.</p>
          <button className="confirm-button" onClick={onConfirm}>
            확인하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default RetryModal; 