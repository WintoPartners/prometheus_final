import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { ICON } from "constant";
import CustomCheckBox from "components/CustomCheckBox";
import CustomRadio from "components/CustomRadio";
import CustomSubjectCheckBox from "components/CustomSubjectCheckBox";
import axios from "axios";

const MAX_STEP = 5;
const subjectArr = [
  { text: "온보딩 설정", imgSrc: ICON.ON_BOARDING, value:"1" },
  { text: "영상 콘텐츠", imgSrc: ICON.VIDEO_CONTENTS, value:"2" },
  { text: "결제하기", imgSrc: ICON.PAYMENT, value:"3" },
  { text: "그룹 & 모임", imgSrc: ICON.GROUP, value:"4" },
  { text: "장바구니", imgSrc: ICON.CART, value:"5" },
  { text: "로그인 & 가입", imgSrc: ICON.LOGIN, value:"6" },
  { text: "판매상품 등록", imgSrc: ICON.REGISTRATION , value:"7"},
  { text: "지도보기", imgSrc: ICON.MAP, value:"8" },
  { text: "별점 & 평가", imgSrc: ICON.START, value:"9" },
  { text: "다국어", imgSrc: ICON.TRANSLATE, value:"10" },
  { text: "회원 분류하기", imgSrc: ICON.CLASSIFICATION, value:"11" },
  { text: "콘텐츠 스크랩", imgSrc: ICON.CLIPPINGS, value:"12" },
  { text: "GPS", imgSrc: ICON.GPS, value:"13" },
  { text: "투표하기", imgSrc: ICON.VOTE, value:"14" },
  { text: "주문 관리", imgSrc: ICON.ORDER, value:"15" },
  { text: "홈 화면 구성", imgSrc: ICON.HOME, value:"16" },
  { text: "알림 보내기", imgSrc: ICON.ALERT, value:"17" },
  { text: "매칭", imgSrc: ICON.MATCH, value:"18" },
  { text: "테스트, 시험", imgSrc: ICON.TEST, value:"19" },
  { text: "팔로우", imgSrc: ICON.FOLLOW, value:"20" },
  { text: "일반 콘텐츠", imgSrc: ICON.BASIC_CONTENTS, value:"21" },
  { text: "검색", imgSrc: ICON.SEARCH, value:"22" },
  { text: "채팅", imgSrc: ICON.CHAT, value:"23" },
  { text: "통화 & 앱", imgSrc: ICON.CALL, value:"24" },
  { text: "예약하기", imgSrc: ICON.RESERVATION, value:"25" },
  { text: "사진 콘텐츠", imgSrc: ICON.PHOTO_CONTENTS, value:"26" },
];
function StepperPage() {
  const initialSubjects = [
    { text: "온보딩 설정", imgSrc: ICON.ON_BOARDING, value:"1" },
    { text: "영상 콘텐츠", imgSrc: ICON.VIDEO_CONTENTS, value:"2" },
    { text: "결제하기", imgSrc: ICON.PAYMENT, value:"3" },
    { text: "그룹 & 모임", imgSrc: ICON.GROUP, value:"4" },
    { text: "장바구니", imgSrc: ICON.CART, value:"5" },
    { text: "로그인 & 가입", imgSrc: ICON.LOGIN, value:"6" },
    { text: "판매상품 등록", imgSrc: ICON.REGISTRATION , value:"7"},
    { text: "지도보기", imgSrc: ICON.MAP, value:"8" },
    { text: "별점 & 평가", imgSrc: ICON.START, value:"9" },
    { text: "다국어", imgSrc: ICON.TRANSLATE, value:"10" },
    { text: "회원 분류하기", imgSrc: ICON.CLASSIFICATION, value:"11" },
    { text: "콘텐츠 스크랩", imgSrc: ICON.CLIPPINGS, value:"12" },
    { text: "GPS", imgSrc: ICON.GPS, value:"13" },
    { text: "투표하기", imgSrc: ICON.VOTE, value:"14" },
    { text: "주문 관리", imgSrc: ICON.ORDER, value:"15" },
    { text: "홈 화면 구성", imgSrc: ICON.HOME, value:"16" },
    { text: "알림 보내기", imgSrc: ICON.ALERT, value:"17" },
    { text: "매칭", imgSrc: ICON.MATCH, value:"18" },
    { text: "테스트, 시험", imgSrc: ICON.TEST, value:"19" },
    { text: "팔로우", imgSrc: ICON.FOLLOW, value:"20" },
    { text: "일반 콘텐츠", imgSrc: ICON.BASIC_CONTENTS, value:"21" },
    { text: "검색", imgSrc: ICON.SEARCH, value:"22" },
    { text: "채팅", imgSrc: ICON.CHAT, value:"23" },
    { text: "통화 & 앱", imgSrc: ICON.CALL, value:"24" },
    { text: "예약하기", imgSrc: ICON.RESERVATION, value:"25" },
    { text: "사진 콘텐츠", imgSrc: ICON.PHOTO_CONTENTS, value:"26" },
  ];
  const [subjects, setSubjects] = useState(initialSubjects);
  const [showPopup, setShowPopup] = useState(false);
  const [inputValue, setInputValue] = useState(""); // 입력 값 상태 추가
  // 팝업창을 띄우는 함수
  const togglePopup = () => {
    setShowPopup(!showPopup);
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      addSubject();  // 엔터 키를 눌렀을 때 addSubject 함수 호출
    }
  };
  const handleKeyDownNext = (e) => {
    if (e.key === 'Enter') {
      handleNextClick();  // 엔터 키를 눌렀을 때 addSubject 함수 호출
    }
  };
  const addSubject = () => {
    const newValue = subjects.length + 1;
    const newSubject = {
      text: inputValue,
      imgSrc: ICON.ETC, // 예시 아이콘
      value: `${newValue}`,
    };

    setSubjects([...subjects, newSubject]);
    setInputValue("");
    togglePopup();
  };
  const handleInputChange = (e) => {
    setInputValue(e.target.value); // 입력 값 상태 업데이트
  };
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const params = useParams();
  const [projectInfo, setProjectInfo] = useState({
    projectName: '',
    budget: '',
    duration: '',
    agency: '',
    function: '',
    skill: '',
    description: '',
    reference: ''
  });
  const [selectedOptions, setSelectedOptions] = useState([]);
  const handleCheckboxChange = (workType) => {
    setSelectedOptions((prevSelectedOptions) => {
      const newSelectedOptions = prevSelectedOptions.includes(workType) ?
        prevSelectedOptions.filter((option) => option !== workType) :
        [...prevSelectedOptions, workType];
  
      return newSelectedOptions;
    });
  };
  const workTypeToNumber = {
    rec: 1,
    branding: 2,
    app: 3,
    web: 4,
    design: 5,
    marketing: 6,
    translate: 7,
    consulting: 8
  };
  const [selectedDevMethod, setSelectedDevMethod] = useState(null);
  const handleDevMethodChange = (selectedValue) => {
    setSelectedDevMethod(selectedValue);
  };

  const [functionNumbers, setFunctionNumbers] = useState([]);
  
  const handlefunctionCheckChange = (value, isChecked,text) => {
    if (isChecked) {
      if(value>=27){
        setFunctionNumbers(prev => {
          return [...prev, text];
        });
      }else{
        setFunctionNumbers(prev => {
          return [...prev, value];
        });
      }
      // 체크된 경우, 배열에 value 추가
    } else {
      // 체크 해제된 경우, 배열에서 value 제거
      setFunctionNumbers(prev => {
        const newArray = prev.filter(v => v !== value);
        return newArray;
      });
    }
  };

  const [description, setDescription] = useState("");
  const [urlText, setUrlText] = useState("");

  
  const numberToWorkType = Object.keys(workTypeToNumber).reduce((acc, key) => {
    const number = workTypeToNumber[key];
    acc[number] = key;
    return acc;
  }, {});
  useEffect(() => {
    if (parseInt(params.type) === 0) {
      navigate("/step/1");
    }
    const currentStep = parseInt(params.type);
    setStep(currentStep); 

    const fetchProjectInfo = async () => {
      try {
        // const response = await axios.post('https://metheus.store/projectInfo',null,{
        //   withCredentials: true // 쿠키 포함 설정
        // }); // 서버 엔드포인트 호출

        const response = await axios.post(`${process.env.REACT_APP_API_ENDPOINT}/projectInfo`,null,{
          withCredentials: true // 쿠키 포함 설정
        }); 
        if (response.data) {
          setProjectInfo({
            projectName: response.data.pro_name,
            budget: response.data.pro_budget,
            duration: response.data.pro_period,
            agency: response.data.pro_agency,
            function: response.data.pro_function,
            skill: response.data.pro_skill,
            description: response.data.pro_description,
            reference: response.data.pro_reference
          });
          if (response.data && response.data.pro_function) {
            const functionNumbers = response.data.pro_function.split(',').map(num => num.trim());
            setFunctionNumbers(functionNumbers);
          }
          if (response.data && response.data.pro_agency) {
            const agencyArray = response.data.pro_agency.split(',')
                    .map(num => numberToWorkType[num.trim()])
                    .filter(Boolean); // 빈 문자열 제거
            setSelectedOptions(agencyArray);
          }
          if (response.data && response.data.pro_skill !== undefined) {
            setSelectedDevMethod(Number(response.data.pro_skill));
          }
          if (response.data && response.data.pro_description !== undefined) {
            setDescription(response.data.pro_description);
          }
          if (response.data && response.data.pro_reference !== undefined) {
            setUrlText(response.data.pro_reference);
          }
        }
      } catch (error) {
        console.error('Error fetching project info:', error);
      }
    };
    fetchProjectInfo();
  }, [params.type]);

  const handleChange = (e, field) => {
    setProjectInfo(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleNextClick = async () => {
    if (!projectInfo.projectName) {
      alert('프로젝트 이름이 입력되지 않았습니다. 정보를 입력해주세요.');
      return; // 함수 실행 중지
    }
    if (!projectInfo.budget ) {
      alert('프로젝트 예산이 입력되지 않았습니다. 정보를 입력해주세요.');
      return; // 함수 실행 중지
    }
    if (!projectInfo.duration) {
      alert('프로젝트 기간이 입력되지 않았습니다. 정보를 입력해주세요.');
      return; // 함수 실행 중지
    }
      let nextStep;
      const agencyNumbers = selectedOptions
        .map(option => workTypeToNumber[option])
        .filter(number => number !== undefined);

      if (parseInt(params.type) === 1) {
        const projectData = {
          projectName: projectInfo.projectName,
          budget: projectInfo.budget,
          duration: projectInfo.duration,
        };
        try {
          // API 호출
          // const response = await axios.post('https://metheus.store/proAbout',projectData, {
          //   withCredentials: true // 쿠키 포함 설정
          // });

          const response = await axios.post(`${process.env.REACT_APP_API_ENDPOINT}/proAbout`,projectData, {
            withCredentials: true // 쿠키 포함 설정
          });
          // 필요한 추가 작업을 여기에서 수행하세요.
        } catch (error) {
          console.error('Error sending data:', error);
        }
      }

      if (parseInt(params.type) === 2) {
        try {
          if (agencyNumbers.length === 0) {
            alert('하나 이상의 에이전시 유형을 선택해주세요.');
            return; // 함수 실행을 중지하여 더 이상 진행되지 않도록 함
          }
          // 선택된 agencyNumbers와 사용자 IP를 서버로 전송
          // await axios.post('https://metheus.store/updateAgencyNumbers', agencyNumbers,{
          //   withCredentials: true // 쿠키 포함 설정
          // });
          await axios.post(`${process.env.REACT_APP_API_ENDPOINT}/updateAgencyNumbers`, agencyNumbers,{
            withCredentials: true // 쿠키 포함 설정
          });
        } catch (error) {
          console.error('Error sending agency numbers:', error);
        }
      }

      if (parseInt(params.type) === 3) {
        nextStep = 4;
        if (selectedDevMethod === null || isNaN(selectedDevMethod)) {
          alert('개발 방식을 선택해주세요.');
          return; // 함수 실행 중지
        }
        try {
          // 선택된 agencyNumbers와 사용자 IP를 서버로 전송
          // await axios.post('https://metheus.store/updateSkillNumbers', { skillNumber: selectedDevMethod },{
          //   withCredentials: true // 쿠키 포함 설정
          // });
          await axios.post(`${process.env.REACT_APP_API_ENDPOINT}/updateSkillNumbers`, { skillNumber: selectedDevMethod },{
            withCredentials: true // 쿠키 포함 설정
          });
        } catch (error) {
          console.error('Error sending agency numbers:', error);
        }
      } else {
        // 3단계가 아닐 경우의 로직 (기존 로직 유지)
        const isAppOrWebSelected = selectedOptions.includes('app') || selectedOptions.includes('web');
        if (step === 2 && isAppOrWebSelected) {
          nextStep = 3; // '앱 개발' 또는 '웹 개발'이 선택되었다면 3단계로 이동
        } else if (step === 2 && !isAppOrWebSelected) {
          nextStep = 4; // '앱 개발' 또는 '웹 개발'이 선택되지 않았다면 4단계로 이동
        } else {
          nextStep = Math.min(parseInt(params.type) + 1, MAX_STEP); // 그 외의 경우 기존 로직을 따릅니다.
        }
      }
      
      if (parseInt(params.type) === 4) {
        if (description === null || description ==='') {
          alert('프로젝트 설명이 입력되지 않았습니다. 설명을 입력해주세요.');
          return; // 함수 실행 중지
        }
        try {
          // const response = await axios.post('https://metheus.store/updateDescription', 
          //   {description: description,urlText: urlText},{
          //     withCredentials: true // 쿠키 포함 설정
          //   } // 사용자 입력
          // );
          const response = await axios.post(`${process.env.REACT_APP_API_ENDPOINT}/updateDescription`, 
            {description: description,
              urlText: urlText
            },{
              withCredentials: true // 쿠키 포함 설정
            } // 사용자 입력
          );
        } catch (error) {
          console.error('저장 실패:', error);
        }
      }
      navigate(`/step/${nextStep}`);

      if (step === MAX_STEP) {
        try {
          if (functionNumbers.length === 0) {
            alert('하나 이상의 기능 주제를 선택해주세요.');
            return; // 함수 실행을 중지하여 더 이상 진행되지 않도록 함
          }
          // 선택된 agencyNumbers와 사용자 IP를 서버로 전송
          navigate("/loading");
          // await axios.post('https://metheus.store/updatefunctionNumbers',  { functionNumbers },{
          //   withCredentials: true // 쿠키 포함 설정
          // });
          await axios.post(`${process.env.REACT_APP_API_ENDPOINT}/updatefunctionNumbers`, { functionNumbers },{
            withCredentials: true // 쿠키 포함 설정
          });
        } catch (error) {
          console.error('Error sending agency numbers:', error);
        }
        navigate("/result");
        window.location.reload();
      }
    };
  
  return (
    <div className="contents">
      <div>
        <div className="dynamic-step">
          {/* step 1 */}
          {step === 1 && (
            <div className="step-item">
              {/* Card Heading */}
              <div className="step-item__heading">
                <h3 className="step-item__heading--title">😀 환영합니다!</h3>
                <p className="step-item__heading--description">아웃소싱의 첫 발을 디딘 당신, 환영합니다! 이제 천천히 서로를 알아가볼까요?</p>
              </div>
              <hr className="step-item__hr" />
              {/* Card Contents */}
              <div className="step-item__contents">
                {/* 프로젝트에 대해 알려주세요. */}
                <div className="insert-box">
                  <h4 className="insert-box--heading">
                    <img className="icon-img" src={ICON.CHECK} alt="check icon" />
                    <p>프로젝트에 대해 알려주세요.</p>
                  </h4>

                  <div className="input-wrap">
                    <input type="text" className="custom-input" value={projectInfo.projectName} onChange={e => handleChange(e, 'projectName')} placeholder="프로젝트 이름" />
                  </div>

                  <div className="flex-input-box">
                    <div className="input-wrap">
                      <input type="text" className="custom-input" value={projectInfo.budget} onChange={e => handleChange(e, 'budget')} placeholder="프로젝트 예산" />
                      <span className="type-title">만원</span>
                    </div>
                    <div className="input-wrap">
                      <input type="text" className="custom-input" value={projectInfo.duration} onChange={e => handleChange(e, 'duration')} onKeyDown={handleKeyDownNext} placeholder="프로젝트 기간" />
                      <span className="type-title">개월</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* step 2 
          2단계에서 체크박스값에 따라 3-1 또는 3-2로 분기가 됩니다.
          */}
          {step === 2 && (
            <div className="step-item">
              {/* Card Heading */}
              <div className="step-item__heading">
                <h3 className="step-item__heading--title">👀 무엇을 맡기시나요?</h3>
                <p className="step-item__heading--description">맡기실 에이전시 종류를 모두 선택해주세요.(중복 선택 가능)</p>
              </div>
              <hr className="step-item__hr" />
              {/* Card Contents */}
              <div className="step-item__contents">
                <div className="grid-wrap">
                  {/* REC */}
                  <div className="grid-item">
                    <CustomCheckBox checkId={"REC"} imgSrc={ICON.WORK_TYPE_REC} workType={"rec"} workTypeHeading={"영상/사진"} onChange={() => handleCheckboxChange('rec')} 
  checked={selectedOptions.includes('rec')}/>
                  </div>

                  {/* BRANDING */}
                  <div className="grid-item">
                    <CustomCheckBox checkId={"BRANDING"} imgSrc={ICON.WORK_TYPE_BRANDING} workType={"branding"} workTypeHeading={"브랜딩"} onChange={() => handleCheckboxChange('branding')} 
  checked={selectedOptions.includes('branding')}/>
                  </div>

                  {/* APP */}
                  <div className="grid-item">
                    <CustomCheckBox checkId={"APP"} imgSrc={ICON.WORK_TYPE_APP} workType={"app"} workTypeHeading={"앱 개발"} onChange={() => handleCheckboxChange('app')} 
  checked={selectedOptions.includes('app')}/>
                  </div>

                  {/* WEB */}
                  <div className="grid-item">
                    <CustomCheckBox checkId={"WEB"} imgSrc={ICON.WORK_TYPE_WEB} workType={"web"} workTypeHeading={"웹 개발"} onChange={() => handleCheckboxChange('web')} 
  checked={selectedOptions.includes('web')}/>
                  </div>

                  {/* DESIGN */}
                  <div className="grid-item">
                    <CustomCheckBox checkId={"DESIGN"} imgSrc={ICON.WORK_TYPE_DESIGN} workType={"design"} workTypeHeading={"디자인"} onChange={() => handleCheckboxChange('design')} 
  checked={selectedOptions.includes('design')}/>
                  </div>

                  {/* MARKETING */}
                  <div className="grid-item">
                    <CustomCheckBox checkId={"MARKETING"} imgSrc={ICON.WORK_TYPE_MARKETING} workType={"marketing"} workTypeHeading={"마케팅"} onChange={() => handleCheckboxChange('marketing')} 
  checked={selectedOptions.includes('marketing')}/>
                  </div>

                  {/* TRANSLATE */}
                  <div className="grid-item">
                    <CustomCheckBox checkId={"TRANSLATE"} imgSrc={ICON.WORK_TYPE_TRANSLATE} workType={"translate"} workTypeHeading={"번역/통역"} onChange={() => handleCheckboxChange('translate')} 
  checked={selectedOptions.includes('translate')}/>
                  </div>

                  {/* CONSULTING */}
                  <div className="grid-item">
                    <CustomCheckBox checkId={"CONSULTING"} imgSrc={ICON.WORK_TYPE_CONSULTING} workType={"consulting"} workTypeHeading={"컨설팅"} onChange={() => handleCheckboxChange('consulting')} 
  checked={selectedOptions.includes('consulting')}/>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* step 3-1 개발방식 선탤 */}
          {step === 3 && (
            <div className="step-item">
              {/* Card Heading */}
              <div className="step-item__heading">
                <h3 className="step-item__heading--title">🛠 개발 방식을 선택해주세요!</h3>
                <p className="step-item__heading--description">개발방식에 따라 견적이 달라집니다.</p>
              </div>
              <hr className="step-item__hr" />
              {/* Card Contents */}
              <div className="step-item__contents radio">
                <div className="grid-wrap">
                  <CustomRadio onChange={handleDevMethodChange} selectedDevMethod={selectedDevMethod} />
                </div>
              </div>
            </div>
          )}

          {/* step 3-2 개발방식 직접 타이핑 */}
          {step === 4 && (
            <div className="step-item">
              {/* Card Heading */}
              <div className="step-item__heading">
                <h3 className="step-item__heading--title">✍ 무엇이든 좋아요!</h3>
                <p className="step-item__heading--description">서비스를 이해하기 위한 상세한 설명을 적어주세요.</p>
              </div>
              <hr className="step-item__hr" />
              {/* Card Contents */}
              <div className="step-item__contents">
                <textarea 
                className="custom-textarea" 
                name="text" 
                placeholder="ex) 반려견/반려묘 방문 미용서비스이고... " 
                value={description || ''} 
                onChange={(e) => setDescription(e.target.value)}></textarea>
              </div>
              <p className="step-item__heading--urldescription">참고 레퍼런스 사이트(필요시 입력)</p>
                <input 
                className="url-input" 
                name="url-text" 
                value={urlText || ''}
                placeholder="ex) https://www.naver.com" 
                onChange={(e) => setUrlText(e.target.value)}
                ></input>
            </div>
          )}
          {/* step 4 기능 주제 */}
          {step === 5 && (
            <div className="step-item">
              {/* Card Heading */}
              <div className="step-item__heading">
                <h3 className="step-item__heading--title">💬 기능 주제를 선택하세요!(중복 선택 가능)</h3>
                <div className="step-item__heading__flex">
                </div>
              </div>
              <hr className="step-item__hr" />
              {/* Card Contents */}
              <div className="step-item__contents">
                <div className="check-grid">
                  {subjects.map((subject, index) => {
                    return (
                      <div className="check-grid-item" index={index} key={index}>
                        <CustomSubjectCheckBox 
                        checkId={`custom-checkbox-${index}`}
                        value={subject.value} 
                        workTypeHeading={subject.text} 
                        imgSrc={subject.imgSrc} 
                        index={index} 
                        onChange={(value,isChecked,text) => handlefunctionCheckChange(subject.value, isChecked,text)} 
                        checked={functionNumbers.includes(subject.value)}
                        editable={subject.editable}/>
                      </div>
                    );
                  })}
                  <div className="check-grid-item" index="100">
                      <button className="icon-button" onClick={togglePopup}>
                      <img src={ICON.PLUS} alt="추가" />
                      </button>
                      {showPopup && (
                        <div className="popup-overlay">
                          <div className="popup-content">
                            <h2>추가 기능 입력</h2>
                            <input type="text" value={inputValue} onChange={handleInputChange} onKeyDown={handleKeyDown} placeholder="기능 입력" />
                            <div className="button-container">
                              <button className="add-button" onClick={addSubject}>추가</button>
                              <button className="close-button" onClick={togglePopup}>닫기</button>
                            </div>
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flow-control">
          <button
            className="step-btn prev-btn"
            type="button"
            onClick={() => {
              if (params.type === "1") {
                // eslint-disable-next-line no-restricted-globals
                const confirmLeave = confirm("사이트에서 나가시겠습니까? \n\n적용사항이 사라질 수 있습니다.");
                if (confirmLeave) {
                  // 사용자가 '확인'을 클릭했을 때의 동작
                  // 예: 현재 페이지를 벗어나거나, 홈 페이지로 이동
                  window.location.href = '/init'; // 홈으로 이동
                }
                return;
              }
              const isAppOrWebSelected = selectedOptions.includes('app') || selectedOptions.includes('web');
              let prevStep;
              // 현재 3단계나 4단계일 경우, 이전 단계를 2로 설정합니다.
              if (params.type === "3") {
                prevStep = 2;
              } else if(step === 5 && isAppOrWebSelected) {
                prevStep = 4;
              } else if(step === 4 && isAppOrWebSelected===true) {
                prevStep = 3;
              }else if(step === 4 && isAppOrWebSelected===false) {
                prevStep = 2;
              }else {
                // 그 외의 경우에는 이전 단계를 계산합니다.
                prevStep = Math.max(parseInt(params.type) - 1, 1); // 1보다 작아지지 않도록 합니다.
              }
              navigate(`/step/${prevStep}`);
            }}
          >
            이전
          </button>
          <div className="progress-container">
            <div className="progress-wrap">
              <ProgressBar step={step} />
            </div>
            <div className="count-number">
              <span className="count-current">{step}</span>
              <span className="count-dash">/</span>
              <span className="count-max-step">{MAX_STEP}</span>
            </div>
          </div>
          <button
            className="step-btn next-btn"
            type="button"
            onClick={handleNextClick}
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
}

export default StepperPage;

const ProgressBar = styled.div`
  width: ${(props) => (props.step ? `${(props.step / MAX_STEP) * 100}%` : "0")};
  height: 8px;
  border-radius: 8px;
  background: #4b85f6;
  transition: width 0.5s ease; /* width 변화에 대한 transition 효과 */
`;
