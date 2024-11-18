import { ICON } from "constant";
import React, { useState } from "react";

function CustomRadio({ radioId, imgSrc, workType, workTypeHeading,onChange, selectedDevMethod }) {
  const radioArr = [
    // Recommended Expected Advantages Caution
    {
      id: "a",
      value: 0,
      heading: "자체 개발 ⭐",
      subHeading: "#똑똑한개발자 #IT아웃소싱업체",
      recommendedText: "차별화된 기능을 구현하고자 하는 서비스",
      expectedText: "약 3,000만원 ~",
      advantagesText: "완벽한 기능 커스텀 개발이 가능해요.",
      cautionText: "추후 개발팀 구축과 관리 인력이 필요해요.",
    },
    {
      id: "b",
      value: 1,
      heading: "커머스 솔루션",
      subHeading: "#카페24 #고도몰 #클레이풀",
      recommendedText: "쇼핑몰 구축이 필요한 서비스",
      expectedText: "약 500만원~",
      advantagesText: "커머스와 마케팅을 연계해 작업할 수 있어요.",
      cautionText: "쇼핑몰 외 자체 개발 기능이 많을 시 어려워요.",
    },
    {
      id: "c",
      value: 2,
      heading: "CMS 솔루션",
      subHeading: "#워드프레스 #그누보드 #XE",
      recommendedText: "모듈만으로 개발이 가능한 서비스 (커뮤니티)",
      expectedText: "약 1500만 원~",
      advantagesText: "워드프레스는 다양한 모듈을 연동할 수 있어요.",
      cautionText: "제공 모듈이 아닌 기능은 자체 개발보다 비싸요.",
    },
    {
      id: "d",
      value: 3,
      heading: "노코드 툴",
      subHeading: "#아임웹 #shopify #WIX #webflow 등",
      recommendedText: "브랜드 웹 페이지",
      expectedText: "약 300만 원~",
      advantagesText: "저렴한 가격으로 웹 페이지 구성이 가능해요.",
      cautionText: "툴 제공 기능 외 커스텀이 매우 어려워요.",
    },
  ];
  //const [selectedFruit, setSelectedFruit] = useState(null);
  const onChangeRadio = (e) => {
    //setSelectedFruit(Number(e.target.value));
    onChange(Number(e.target.value)); // 직접 호출
  };

  return (
    <>
      {radioArr.map((item) => {
        return (
          <div className="grid-item" key={item.id}>
            <label htmlFor={item.id} className={`checkbox-label radio ${selectedDevMethod  === item.value ? "checked" : ""}`}>
              <input
                id={item.id}
                type="radio"
                name="developmentMethod"
                value={item.value}
                onChange={onChangeRadio}
                checked={selectedDevMethod  === item.value}
              />

              <div className={`custom-check ${selectedDevMethod  === item.value ? "active" : ""}`}>
                <img src={ICON.INPUT_CHECK} alt="input checked icon" />
              </div>

              <div className="work-type-heading">
                <h4>{item.heading}</h4>
                <p>{item.subHeading}</p>
              </div>

              <div className="work-type-info">
                <div className="info-title recommended">추천</div>
                <p className="info-desc">{item.recommendedText}</p>
                <div className="info-title">예상</div>
                <p className="info-desc">{item.expectedText}</p>
                <div className="info-title">장점</div>
                <p className="info-desc">{item.advantagesText}</p>
                <div className="info-title">주의</div>
                <p className="info-desc">{item.cautionText}</p>
              </div>
            </label>
          </div>
        );
      })}
    </>
  );
}

export default CustomRadio;
