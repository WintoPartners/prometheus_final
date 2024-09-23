import React, { useState,useEffect  } from "react";
import { ICON, PNG } from "constant";
import { useNavigate } from "react-router-dom";
import CustomFileCheckBox from "components/CustomFileCheckBox";

function InitPage() {
  const navigate = useNavigate();
  const [isSelectClick, setIsSelectClick] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // 현재 슬라이드 인덱스 관리

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep(prevStep => (prevStep + 1) % steps.length);
    }, 5000); // 3초마다 슬라이드 변경

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 타이머 정리
  }, [currentStep]); // currentStep이 변경될 때마다 타이머 초기화

  const handleDragOver = (event) => {
    event.preventDefault();
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragOver(false);
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
    }
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleAnalyzeClick = async () => {
    if (!selectedFile) {
      alert('파일을 첨부해주세요.');
      return;
    }
    const allowedExtensions = ['.mp3', '.aac', '.ac3', '.ogg', '.flac', '.wav', '.m4a','.pdf','.txt'];
    const fileExtension = selectedFile.name.slice(((selectedFile.name.lastIndexOf(".") - 1) >>> 0) + 2);
    if (!allowedExtensions.includes('.' + fileExtension.toLowerCase())) {
      alert('지원하지 않는 파일 형식입니다.\n지원되는 파일 형식: .mp3, .aac, .ac3, .ogg, .flac, .wav, .m4a, .pdf, .txt');
      return;
    }
    navigate("/loading");

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/upload`, {
        credentials: 'include',
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        if (data.additionalInfo.subscriptionStatus === 'N') {
          navigate('/subscription');
        } else {
          navigate('/step/1', {
            state: {
              step: 1,
              projectName: data.additionalInfo.projectName,
              budget: data.additionalInfo.budget,
              duration: data.additionalInfo.duration
            }
          });
        }
      } else {
        console.error('File upload failed.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const skipClick = async () => {
    const confirmRetry = window.confirm("파일 첨부 없이 진행하시겠습니까?");
    if (confirmRetry) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/skip`, {
          credentials: 'include',
          method: 'POST',
        });
        if (response.ok) {
          const data = await response.json();
          if (data.additionalInfo.subscriptionStatus === 'N') {
            navigate('/subscription');
          } else {
            navigate("/step/1");
          }
        }
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      return;
    }
  };

  const steps = [
    { text: "1. 내 PC에서 미팅 정리 파일(파일 양식은 첨부하는 부분 확인)을 선택하거나 드래그하여 업로드합니다. 업로드 후 분석하기 버튼을 클릭합니다. 음성파일이 없을 시 skip 버튼을 클릭합니다.", icon: ICON.STEP1 },
    { text: "2. 분석 결과를 확인하고 입력되지 않은 요소들을 직접 입력합니다", icon: ICON.STEP2 },
    { text: "3. GPT가 생성해준 역제안서 결과를 확인하고, 원하는 형식으로 다운로드 합니다.", icon: ICON.STEP3 }
  ];

  return (
    <div className="contents_init">
      <div className="section-left">
        <div className="step-item_init_left" style={{ backgroundImage: `url(${steps[currentStep].icon})` }}>
          <h2>사용 방법</h2>
          <p>{steps[currentStep].text}</p>
          <div className="dots">
          {steps.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === currentStep ? "active" : ""}`}
              onClick={() => setCurrentStep(index)}
            ></span>
          ))}
        </div>
        </div>
        
      </div>
      <div className="section-right">
        <div className="dynamic-step">
          <div className="step-item_init">
            <div className="step-item__heading_init">
              <h3 className="step-item__heading--title_init">🎙 새로 만들기</h3>
              <p className="step-item__heading--description_init">
                내 pc 에서 음성파일을 첨부하거나 끌어오세요.
                <br />
                음성파일 길이는 한번에 최대 120분까지 가능해요.
              </p>
            </div>
            <hr className="step-item__hr_init" />
            <div className="step-item__contents_init">
              <div className="upload-wrap_init">
                <div className="upload-box_init">
                  <div
                    className={`upload-area_init ${isDragOver ? 'drag-over' : ''}`}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onDragLeave={handleDragLeave}
                  >
                    <div className="custom-select-wrap_init">
                    </div>

                    <div className="upload-inner_init">
                      <div className="inner-top">
                        <img src={PNG.UPLOAD_EX} alt="upload img" />
                      </div>
                      <div className="inner-text_init">
                        <p>파일 업로드 시 ‘파일 첨부’를 클릭하거나 직접 끌어다 놓으세요.</p>
                        <p>(mp3, aac, ac3, ogg, flac, wav, m4a, pdf, txt 파일을 지원합니다.)</p>
                      </div>
                      <div className="inner-buttons_init">
                        <label htmlFor="file-upload" className="upload-btn file">
                          파일첨부
                          <img src={ICON.UPLOAD_CLOUD} alt="" />
                        </label>
                        <input
                          id="file-upload"
                          type="file"
                          style={{ display: 'none' }}
                          onChange={handleFileSelect}
                          accept=".mp3,.aac,.ac3,.ogg,.flac,.wav,.m4a,.pdf,.txt"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <ul className="upload-list_init">
                  <li className="upload-item">
                    {selectedFile && (
                      <CustomFileCheckBox
                        fileInfo={selectedFile}
                      />
                    )}
                  </li>
                </ul>
                <div className="button-container">
                  <button
                    className="button analyze-btn3"
                    onClick={() => {
                      handleAnalyzeClick();
                    }}
                  >
                    분석하기
                  </button>
                  <button className="skip-btn" onClick={() => {
                    skipClick();
                  }}>
                    SKIP
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InitPage;
