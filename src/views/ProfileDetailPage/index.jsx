import React, { useState, useEffect } from "react";
import { ICON } from "constant";
import { useParams } from "react-router-dom";
import CustomTimeLine from "components/CustomTimeLine";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Document,AlignmentType, Packer, Paragraph } from 'docx';
import { saveAs } from 'file-saver';

const color = [
  { back: "#ff7c7b" }, // 밝은 빨강
  { back: "#ffa877" }, // 오렌지
  { back: "#6bb8ff" }, // 밝은 파랑
  { back: "#7e8bff" }, // 연한 남색
  { back: "#b587ff" }, // 연보라
  { back: "#ffcc5c" }, // 밝은 노랑
  { back: "#97de95" }, // 연두색
  { back: "#f26d85" }, // 핑크
  { back: "#4dd2ff" }, // 하늘색
  { back: "#d783ff" }, // 진보라
  { back: "#ff926b" }, // 살구색
  { back: "#6ecb63" }, // 녹색
  { back: "#ffe156" }, // 노란색
  { back: "#ff6b6b" }, // 진한 빨강
  { back: "#51dacf" }, // 터콰이즈
  { back: "#c790e1" }, // 연한 자주
  { back: "#f7b267" }, // 샌드 컬러
  { back: "#77dd77" }, // 밝은 녹색
  { back: "#84b6f4" }, // 밝은 청색
  { back: "#d1a3ff" }  // 라벤더
];
function ResultPage() {
  const { id } = useParams();
  const [funcDesc, setFuncDesc] = useState('');
  async function fetchTasks() {
    const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/setProjectDetail`, {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
    },
      body: JSON.stringify({ id: id })
    }); // API 엔드포인트는 예시입니다.
    // response = await fetch('https://metheus.store/setProjectDetail', {
    //   credentials: 'include',
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    // },
    //   body: JSON.stringify({ id: id })
    // });
    if (!response.ok) {
      throw new Error('Server error');
    }
    return response.json();
  }
  
  async function setIA() {
    const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/setIADetail`, {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
    },
      body: JSON.stringify({ id: id })
    }); // API 엔드포인트는 예시입니다.
    // const response = await fetch('https://metheus.store/setIADetail', {
    //   credentials: 'include',
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    // },
    //   body: JSON.stringify({ id: id })
    // }); 
    if (!response.ok) {
      throw new Error('Server error');
    }
    return response.json();
  }
  async function fetchWBS() {
    const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/setWbsDetail`, {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
    },
      body: JSON.stringify({ id: id })
    }); // API 엔드포인트는 예시입니다.
    // const response = await fetch('https://metheus.store/setWbsDetail', {
    //   credentials: 'include',
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    // },
    //   body: JSON.stringify({ id: id })
    // }); 
    
    if (!response.ok) {
      throw new Error('Server error');
    }
    return response.json();
  }
  async function fetchFuncDesc() {
    const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/getFuncDesc`, {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: id })
    });
    if (!response.ok) {
      throw new Error('Server error');
    }
    return response.json();
  }
  
  const [rfpData, setRfpData] = useState({
    pro_name: '',
    pro_budget: '',
    pro_period: '',
    pro_service: '',
    pro_output: '',
    expected_budget: '',
    expected_period: '',
    pro_agency: '',
    pro_reference: ''
  });
  const [iaData, setIaData] = useState([]);
  function preprocessData(iaData) {
    // 초기 상태값 설정
    let depth1Count = {}, depth2Count = {}, depth3Count = {};
  
    // 첫 번째 통과: 각 depth별 연속 행 수 계산
    iaData.forEach((row, index) => {
      if (!depth1Count[row.depth1]) {
        depth1Count[row.depth1] = 1;
      } else if (index > 0 && iaData[index - 1].depth1 === row.depth1) {
        depth1Count[row.depth1]++;
      }
  
      const depth2Key = `${row.depth1}_${row.depth2}`;
      if (!depth2Count[depth2Key]) {
        depth2Count[depth2Key] = 1;
      } else if (index > 0 && iaData[index - 1].depth2 === row.depth2 && iaData[index - 1].depth1 === row.depth1) {
        depth2Count[depth2Key]++;
      }
  
      const depth3Key = `${row.depth1}_${row.depth2}_${row.depth3}`;
      if (!depth3Count[depth3Key]) {
        depth3Count[depth3Key] = 1;
      } else if (index > 0 && iaData[index - 1].depth3 === row.depth3 && iaData[index - 1].depth2 === row.depth2 && iaData[index - 1].depth1 === row.depth1) {
        depth3Count[depth3Key]++;
      }
    });
  
    // 두 번째 통과: rowspan 설정
    let lastDepth1 = "", lastDepth2 = "", lastDepth3 = "";
    iaData.forEach(row => {
      if (lastDepth1 !== row.depth1) {
        row.depth1Rowspan = depth1Count[row.depth1];
        lastDepth1 = row.depth1;
      } else {
        row.depth1Rowspan = 0;
      }
  
      const depth2Key = `${row.depth1}_${row.depth2}`;
      if (lastDepth2 !== depth2Key) {
        row.depth2Rowspan = depth2Count[depth2Key];
        lastDepth2 = depth2Key;
      } else {
        row.depth2Rowspan = 0;
      }
  
      const depth3Key = `${row.depth1}_${row.depth2}_${row.depth3}`;
      if (lastDepth3 !== depth3Key) {
        row.depth3Rowspan = depth3Count[depth3Key];
        lastDepth3 = depth3Key;
      } else {
        row.depth3Rowspan = 0;
      }
    });
  
    return iaData;
  }


    const [tasks, setTasks] = useState([]);
  useEffect(() => {
    // RFP 데이터를 가져오는 비동기 함수
    const fetchRfpData = async () => {
      try {
        const projectInfo = await fetchTasks();
        setRfpData(projectInfo[0]);
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      } 
      // 가져온 데이터로 상태 업데이트
    };
    const fetchIaData = async () => {
      try {
        const iaInfo = await setIA();
        setIaData(preprocessData(iaInfo)); // 가져온 데이터로 상태 업데이트
      } catch (error) {
        console.error('Failed to fetch IA data:', error);
      }
    };
    const getTasks = async () => {
      try {
        // WBS 데이터를 서버에서 불러옵니다.
        const tasksFromServer = await fetchWBS();
        // 불러온 데이터에 색상을 할당합니다.
        const tasksWithColor = tasksFromServer.map((task, index) => ({
          ...task,
          // 색상 배열에서 순환적으로 색상을 선택합니다.
          color: color[index % color.length].back,
        }));
        setTasks(tasksWithColor);
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      }
    };
    
    const fetchFuncDescData = async () => {
      try {
        const funcDescData = await fetchFuncDesc();
        setFuncDesc(funcDescData[0]);

      } catch (error) {
        console.error('Failed to fetch funcDesc:', error);
      }
    };

    fetchRfpData();
    fetchIaData();
    getTasks();
    fetchFuncDescData();
  }, []);
  
  const savePDF = () => {
    const input = document.getElementById("result-wrap");
    if (!input) {
      console.error("Element with ID 'result-wrap' not found!");
      return;
    }
    
    const headings = input.querySelectorAll(".result-heading");
    headings.forEach(heading => {
      heading.style.borderRadius = "0";
    });
  
    // High resolution scale for better quality
    const scale = 4;
  
    html2canvas(input, { scale: scale }).then((canvas) => {
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = 210; // A4 page width in mm
      const pageHeight = 297; // A4 page height in mm
      const sideMargin = 10; // Side margin in mm
      const topMargin = 10; // Top margin in mm
      const bottomMargin = 10; // Bottom margin in mm
  
      const imgWidth = pageWidth - (sideMargin * 2); // Adjust the image width for the side margins
      let imgHeight = (canvas.height * imgWidth) / (canvas.width / scale); // Calculate the adjusted image height
      let positionX = sideMargin; // Starting position on X-axis with side margin
      let positionY = topMargin; // Starting position on Y-axis with top margin
      let currentPageHeight = 0; // Track the current height on the page
  
      // This loop will go over each section of the image and add it to the PDF
      for (let y = 0; y < canvas.height; y += currentPageHeight) {
        // Calculate the remaining height of the image
        let remainingImgHeightPx = canvas.height - y;
  
        // Calculate the height of the image section to add to the current PDF page
        currentPageHeight = Math.min(
          ((pageHeight - topMargin - bottomMargin) / imgWidth) * canvas.width,
          remainingImgHeightPx
        );
  
        // Create a canvas for the current section of the image
        let sectionCanvas = document.createElement('canvas');
        sectionCanvas.width = canvas.width;
        sectionCanvas.height = currentPageHeight;
        let ctx = sectionCanvas.getContext('2d');
  
        // Draw the section of the image on the new canvas
        ctx.drawImage(
          canvas,
          0, y, canvas.width, currentPageHeight, // Source rectangle parameters
          0, 0, canvas.width, currentPageHeight // Destination rectangle parameters
        );
  
        // Convert the current section to an image data URL
        let sectionImgData = sectionCanvas.toDataURL("image/jpeg", 1.0);
  
        // Add the section to the PDF
        pdf.addImage(sectionImgData, "JPEG", positionX, positionY, imgWidth, (currentPageHeight * imgWidth) / canvas.width);
  
        // If there's more image to add, create a new PDF page
        if (y + currentPageHeight < canvas.height) {
          pdf.addPage();
        }
      }
  
      pdf.save("download.pdf");
      headings.forEach(heading => {
        heading.style.borderRadius = "30px 30px 0 0";
      });
    });
  };
  
  

    const saveDocx = () => {
      const processFuncDesc = () => {
        if (!funcDesc.pro_funcdesc) return [];
    
        return funcDesc.pro_funcdesc.split('\n').map(line => {
          const trimmedLine = line.trim();
          let indentLevel = 0;
          let text = trimmedLine;
    
          if (/^\d+\.\s/.test(trimmedLine)) {  // 1.
            indentLevel = 0;
            text = trimmedLine.replace(/^(\d+)\./, '$1.');
          } else if (/^\d+\.\d+\.\s/.test(trimmedLine)) {  // 1.1.
            indentLevel = 1;
            text = trimmedLine.replace(/^(\d+)\.(\d+)\./, '  $2)');
          } else if (/^\d+\.\d+\.\d+\.\s/.test(trimmedLine)) {  // 1.1.1.
            indentLevel = 2;
            text = trimmedLine.replace(/^(\d+)\.(\d+)\.(\d+)\./, '    ($3)');
          } else if (/^\d+\.\d+\.\d+\.\d+\.\s/.test(trimmedLine)) {  // 1.1.1.1.
            indentLevel = 3;
            text = trimmedLine.replace(/^(\d+)\.(\d+)\.(\d+)\.(\d+)\./, '      $4.');
          }
    
          return new Paragraph({
            text: text,
            indent: {
              left: 240 * indentLevel
            }
          });
        });
      };
    
      const doc = new Document({
        styles: {
          paragraphStyles: [
            {
              id: "smallText",
              name: "Small Text",
              basedOn: "Normal",
              run: {
                size: 20, // 10pt 글자 크기
              },
              paragraph: {
                spacing: {
                  after: 120, // 문단 뒤 간격
                },
              },
            },
            {
              id: "details",
              name: "Details",
              basedOn: "Normal",
              run: {
                size: 24, // 12pt 글자 크기
              },
            },
            {
              id: "heading1",
              name: "Heading 1",
              basedOn: "Normal",
              run: {
                size: 36, // 18pt 글자 크기
                bold: true,
                color: "000000", // 검정색
              },
              paragraph: {
                spacing: {
                  before: 300, // 제목 위 간격
                  after: 240, // 제목 아래 간격
                },
              },
            },
            {
              id: "heading2",
              name: "Heading 2",
              basedOn: "Normal",
              run: {
                size: 32, // 16pt 글자 크기
                bold: true,
                color: "555555", // 회색
              },
              paragraph: {
                spacing: {
                  before: 240, // 제목 위 간격
                  after: 120, // 제목 아래 간격
                },
              },
            },
            {
              id: "centeredText",
              name: "Centered Text",
              basedOn: "Normal",
              run: {
                size: 36, // 18pt 글자 크기
                bold: true,
                color: "000000", // 검정색
              },
              paragraph: {
                alignment: AlignmentType.CENTER,
                spacing: {
                  before: 300, // 제목 위 간격
                  after: 240, // 제목 아래 간격
                },
              },
            },
          ],
        },
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                text: "사업제안 구성",
                style: "centeredText",
              }),
              new Paragraph({
                text: "0. 프로젝트 개요",
                style: "heading1",
              }),
              new Paragraph({
                text: `- 프로젝트 명: ${rfpData.pro_name}`,
                style: "details",
              }),
              new Paragraph({
                text: `- 예산: ${rfpData.pro_budget} 만원`,
                style: "details",
              }),
              new Paragraph({
                text: `- 기간: ${rfpData.pro_period}`,
                style: "details",
              }),
    
              new Paragraph({
                text: "1. 산출물",
                style: "heading1",
              }),
              new Paragraph({
                text: "① 서비스 요구사항",
                style: "heading2",
              }),
              ...rfpData.pro_service.split('\n').map(service => new Paragraph({ text: service, style: "details" })),
              new Paragraph({
                text: "② 필요 산출물",
                style: "heading2",
              }),
              ...rfpData.pro_output.split('\n').map(output => new Paragraph({ text: output, style: "details" })),
              new Paragraph({
                text: "③ 기능 명세서",
                style: "heading2",
              }),
              ...processFuncDesc(),
    
              new Paragraph({
                text: "2. 프로젝트 계획",
                style: "heading1",
              }),
              new Paragraph({
                text: "WBS",
                style: "heading2",
              }),
              ...funcDesc.wbs_doc.split('-').filter(item => item.trim() !== "").map(item => new Paragraph({
                text: `- ${item.trim()}`,
                style: "smallText"
              })),
            ],
          },
        ],
      });
    
      Packer.toBlob(doc).then(blob => {
        saveAs(blob, `ProjectDetails-${rfpData.pro_name}.docx`);
      }).catch(err => {
        console.error('Error creating document:', err);
      });
    };
    
  return (
    <div className="contents">
      <div>
        <div className="result-wrap">
          <div id="result-wrap">
          <div className="result-card" id="projectInfo">
            <div className="result-heading">
              <h3>프로젝트 개요</h3>
            </div>

            <div className="result-contents" id ="projectInfoPdf">
              <div className="result-contents--top">
                <div className="left">
                  <p className="sub-text">{rfpData?.pro_agency}</p>
                  <p className="head-text">{rfpData?.pro_name}</p>
                </div>
              </div>
              <div className="result-contents--bottom">
                <div className="mini-card-wrap">
                  <div className="mini-card-item price">
                    <div className="mini-card-item__heading">
                      <p>예상 견적</p>
                    </div>
                    <div className="mini-card-item__contents">
                      <p className="head-title">
                        약&nbsp;&nbsp;<span>{rfpData?.pro_budget}</span>&nbsp;만원
                      </p>
                      <p className="sub-title">희망 견적 : {rfpData?.expected_budget} 만원 </p>
                    </div>
                  </div>

                  <div className="mini-card-item time">
                    <div className="mini-card-item__heading">
                      <p>예상 기간</p>
                    </div>
                    <div className="mini-card-item__contents">
                      <p className="head-title">
                        약&nbsp;&nbsp;<span>{rfpData?.pro_period}</span>&nbsp;미만
                      </p>
                      <p className="sub-title">희망 기간 : {rfpData?.expected_period} 개월 </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="result-card" id="projectOutput">
            <div className="result-heading">
              <h3>요구사항 및 산출물</h3>
            </div>

            <div className="result-contents" id="projectOutputPdf">
              {/* <div className="middle-card">
                <div className="middle-card__heading">
                  <img className="img" src={ICON.PENCIL} alt="icon" />
                  <p>서비스 스펙 / 환경 / 방식</p>
                </div>

                <div className="middle-card__contents">
                  <p>
                  
                  </p>
                </div>
              </div>

              <div className="middle-card">
                <div className="middle-card__heading">
                  <img className="img" src={ICON.PAPER} alt="icon" />
                  <p>
                    서비스 <span className="sub-text">(필요 요소)</span>
                  </p>
                </div>
                <div className="middle-card__contents">
                <p>1</p>
                </div>
              </div> */}

              <div className="middle-card">
                <div className="middle-card__heading">
                  <img className="img" src={ICON.COMMENT} alt="icon" />
                  <p>서비스 요구사항</p>
                </div>

                <div className="middle-card__contents">
                {rfpData?.pro_service.split('\n').map((line, index) => (
                // 각 줄을 p 태그로 감싸서 렌더링합니다.
                // React는 리스트의 각 요소를 구별하기 위해 고유한 key가 필요합니다.
                <p key={index}>
                  {line}
                </p>
              ))}
                </div>
              </div>

              <div className="middle-card">
                <div className="middle-card__heading">
                  <img className="img" src={ICON.PUZZLE} alt="icon" />
                  <p>필요 산출물</p>
                </div>

                <div className="middle-card__contents">
                    {rfpData?.pro_output.split('\n').map((line, index) => (
                // 각 줄을 p 태그로 감싸서 렌더링합니다.
                // React는 리스트의 각 요소를 구별하기 위해 고유한 key가 필요합니다.
                <p key={index}>
                  {line}
                </p>
              ))}
                </div>
              </div>

              {
                rfpData?.pro_reference && (
                  <div className="middle-card">
                    <div className="middle-card__heading">
                      <img className="img" src={ICON.REFERENCE} alt="icon" />
                      <p>동종업체 레퍼런스</p>
                    </div>
                    <div className="middle-card__contents">
                      <div className="more-info">
                        <img src={ICON.PLUS} alt="" />
                        <span>참고 하세요!</span>
                      </div>
                      <ul className="link-list">
                        <li>
                          <a href={`https://${rfpData?.pro_reference}`} target="_blank" rel="noopener noreferrer">
                            <img src={ICON.CLIP} alt="" />
                            <span>{rfpData?.pro_reference}</span>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                )
              }
            </div>
          </div>

          <div className="result-card" id="projectIA">
            <div className="result-heading">
              <h3>기능 명세서</h3>
            </div>

            <div className="result-contents" id="projectIAPdf">
            <table className="grid-table-wrap">
                <thead className="grid-table-item head">
                  <tr>
                    <th className="table-item">1 Depth</th>
                    <th className="table-item">2 Depth</th>
                    <th className="table-item">3 Depth</th>
                    <th className="table-item">4 Depth</th>
                  </tr>
                  </thead>
                  <tbody>
                  {iaData.map((row, index) => (
                    <tr key={index} className="">
                      {row.depth1Rowspan > 0 &&<td className="table-item" rowSpan={row.depth1Rowspan} style={{ borderRight: "1px solid #e7e7e7", backgroundColor: "#babbbd" ,justifyContent: "center" ,verticalAlign: "middle"  }}>{row.depth1}</td>}
                      {row.depth2Rowspan > 0 &&<td className="table-item" rowSpan={row.depth2Rowspan} style={{ backgroundColor: 'white',justifyContent: "center" ,verticalAlign: "middle"  }}>{row.depth2 || '-'}</td>}
                      {row.depth3Rowspan > 0 &&<td className="table-item" rowSpan={row.depth3Rowspan} style={{ backgroundColor: 'white',justifyContent: "center" ,verticalAlign: "middle"  }}>{row.depth3 || '-'}</td>}
                      <td className="table-item" style={{ backgroundColor: 'white' ,justifyContent: "center" ,verticalAlign: "middle" }}>{row.depth4 || '-'}</td>
                    </tr>
                  ))}
                  </tbody>
              </table>
            </div>
          </div>
          
          <div className="result-card" id="projectWBS">
            <div className="result-heading">
              <h3>WBS</h3>
            </div>

            <div className="result-contents overflow" id="projectWBSPdf">
              <CustomTimeLine tasks={tasks}/>
            </div>
          </div>
          </div>
          <div className="result-card last detail">
            <div className="result-heading" style={{alignItems:'center'}}>
              <h3>✨ 이 프로젝트 제안서를 ✨</h3>
            </div>

            <div className="result-contents" style={{padding:'0px 67px 30px 67px'}}>
              <div className="button-container">
              <button className="button analyze-btn" onClick={savePDF}>
            <div className="button-text">
              <span style={{ fontSize: '24px', color:'white', fontFamily:'Pretendard' }}>PDF로 저장</span>
              <span style={{ fontSize: '16px', color:'white', fontFamily:'Pretendard', fontWeight:'normal' }}>이 결과로 업체에 역제안 하세요.</span>
              
            </div>
            <div className="button-icon-container">
              <span style={{ fontSize: '14px', color:'white', fontFamily:'Pretendard', fontWeight:'normal' }}>다운로드&gt;</span>
              <img src={ICON.PDF} alt="PDF Icon" className="button-icon" />
            </div>
          </button>
          <button className="button docx-btn" onClick={saveDocx}>
            <div className="button-text">
              <span style={{ fontSize: '24px', color:'white', fontFamily:'Pretendard' }}>DOCX로 저장</span>
              <span style={{ fontSize: '16px', color:'white', fontFamily:'Pretendard', fontWeight:'normal' }}>이 결과로 업체에 역제안 하세요.</span>
              
            </div>
            <div className="button-icon-container">
              <span style={{ fontSize: '14px', color:'white', fontFamily:'Pretendard', fontWeight:'normal' }}>다운로드&gt;</span>
              <img src={ICON.DOCX} alt="PDF Icon" className="button-icon" />
            </div>
          </button>
                </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultPage;
