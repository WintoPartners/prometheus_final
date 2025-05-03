import React, { useState, useEffect } from 'react';
import adminApi from '../../utils/adminApi';
import './AdminPage.css';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [projectDetails, setProjectDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('info');
  const [iaData, setIaData] = useState([]);
  const [wbsData, setWbsData] = useState([]);
  const [funcDesc, setFuncDesc] = useState('');
  const [apiErrors, setApiErrors] = useState({});

  // 서버에서 온 데이터 저장
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

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await adminApi.get('/admin/projects');
        setProjects(response.data.data);
        setError('');
      } catch (err) {
        console.error('프로젝트 목록 로딩 실패:', err);
        setError('프로젝트 데이터를 로드하는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // 로그를 추가하여 API 응답 구조 확인
  const logApiResponse = (name, data) => {
    console.log(`[API 응답] ${name}:`, data);
    console.log(`[API 응답 타입] ${name}:`, typeof data, Array.isArray(data));
    if (data) {
      console.log(`[API 응답 구조] ${name}:`, Object.keys(data));
    }
  };

  // 1. 프로젝트 상세 정보 가져오기 (ProfileDetailPage의 fetchTasks와 동일)
  const fetchRfpData = async (projectId) => {
    try {
      console.log(`[API 호출] setProjectDetail - ID: ${projectId}`);
      const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/setProjectDetail`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: projectId })
      });
      
      if (!response.ok) {
        throw new Error(`API 요청 실패: ${response.status}`);
      }
      
      const data = await response.json();
      logApiResponse('setProjectDetail', data);
      return data;
    } catch (error) {
      console.error('프로젝트 상세 정보 로딩 실패:', error);
      setApiErrors(prev => ({ ...prev, projectDetails: error.message }));
      return [];
    }
  };

  // 2. IA 데이터 가져오기 (ProfileDetailPage의 setIA와 동일)
  const fetchIaData = async (projectId) => {
    try {
      console.log(`[API 호출] setIADetail - ID: ${projectId}`);
      const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/setIADetail`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: projectId })
      });
      
      if (!response.ok) {
        throw new Error(`IA 데이터 로딩 실패: ${response.status}`);
      }
      
      const data = await response.json();
      logApiResponse('setIADetail', data);
      return data;
    } catch (error) {
      console.error('IA 데이터 로딩 실패:', error);
      setApiErrors(prev => ({ ...prev, iaData: error.message }));
      return [];
    }
  };

  // 3. WBS 데이터 가져오기 (ProfileDetailPage의 fetchWBS와 동일)
  const fetchWbsData = async (projectId) => {
    try {
      console.log(`[API 호출] setWbsDetail - ID: ${projectId}`);
      const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/setWbsDetail`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: projectId })
      });
      
      if (!response.ok) {
        throw new Error(`WBS 데이터 로딩 실패: ${response.status}`);
      }
      
      const data = await response.json();
      logApiResponse('setWbsDetail', data);
      return data;
    } catch (error) {
      console.error('WBS 데이터 로딩 실패:', error);
      setApiErrors(prev => ({ ...prev, wbsData: error.message }));
      return [];
    }
  };

  // 4. 기능 설명 가져오기 (ProfileDetailPage의 fetchFuncDesc와 동일)
  const fetchFuncDesc = async (projectId) => {
    try {
      console.log(`[API 호출] getFuncDesc - ID: ${projectId}`);
      const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/getFuncDesc`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: projectId })
      });
      
      if (!response.ok) {
        throw new Error(`기능 설명 로딩 실패: ${response.status}`);
      }
      
      const data = await response.json();
      logApiResponse('getFuncDesc', data);
      return data;
    } catch (error) {
      console.error('기능 설명 로딩 실패:', error);
      setApiErrors(prev => ({ ...prev, funcDesc: error.message }));
      return [];
    }
  };

  // 프로젝트 데이터 처리 (ProfileDetailPage와 동일한 방식)
  const preprocessData = (iaData) => {
    if (!Array.isArray(iaData) || iaData.length === 0) return [];
    return iaData;
  };

  const handleProjectClick = async (project) => {
    setSelectedProject(project);
    setDetailsLoading(true);
    setModalOpen(true);
    setActiveTab('info');
    setApiErrors({});
    
    try {
      // 기본 정보 설정
      setProjectDetails(project);
      
      // 1. 프로젝트 RFP 데이터 로드 (ProfileDetailPage의 fetchRfpData와 동일)
      const projectInfo = await fetchRfpData(project.id);
      if (projectInfo && projectInfo.length > 0) {
        setRfpData(projectInfo[0]);
        console.log("[RFP 데이터]", projectInfo[0]);
      }
      
      // 2. IA 데이터 로드 (ProfileDetailPage의 fetchIaData와 동일)
      const iaInfo = await fetchIaData(project.id);
      setIaData(preprocessData(iaInfo));
      console.log("[IA 데이터]", iaInfo);
      
      // 3. WBS 데이터 로드 (ProfileDetailPage의 getTasks와 동일)
      const tasksFromServer = await fetchWbsData(project.id);
      setWbsData(tasksFromServer || []);
      console.log("[WBS 데이터]", tasksFromServer);
      
      // 4. 기능 설명 로드 (ProfileDetailPage의 fetchFuncDescData와 동일)
      const funcDescData = await fetchFuncDesc(project.id);
      if (funcDescData && funcDescData.length > 0) {
        setFuncDesc(funcDescData[0]);
        console.log("[기능 설명]", funcDescData[0]);
      }
      
    } catch (err) {
      console.error('프로젝트 상세 정보 로딩 실패:', err);
    } finally {
      setDetailsLoading(false);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedProject(null);
    setProjectDetails(null);
    setIaData([]);
    setWbsData([]);
    setFuncDesc('');
    setApiErrors({});
    setRfpData({
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
  };

  // 데이터 유효성 검사
  const hasIaData = Array.isArray(iaData) && iaData.length > 0;
  const hasWbsData = Array.isArray(wbsData) && wbsData.length > 0;
  const hasFuncDesc = funcDesc && (funcDesc.description || typeof funcDesc === 'string');
  
  // 기능 설명 텍스트 가져오기
  const getFuncDescText = () => {
    if (!funcDesc) return '';
    if (typeof funcDesc === 'string') return funcDesc;
    if (funcDesc.description) return funcDesc.description;
    return JSON.stringify(funcDesc);
  };

  // 모달 컴포넌트
  const ProjectDetailsModal = () => {
    if (!modalOpen) return null;

    return (
      <div className="modal-overlay" onClick={closeModal}>
        <div className="project-detail-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>{rfpData?.pro_name || selectedProject?.name || '프로젝트 상세'}</h3>
            <button className="close-button" onClick={closeModal}>×</button>
          </div>
          
          <div className="modal-tabs">
            <button 
              className={`modal-tab ${activeTab === 'info' ? 'active' : ''}`}
              onClick={() => handleTabChange('info')}
            >
              기본 정보
            </button>
            <button 
              className={`modal-tab ${activeTab === 'requirements' ? 'active' : ''}`}
              onClick={() => handleTabChange('requirements')}
            >
              요구사항 및 산출물
            </button>
            <button 
              className={`modal-tab ${activeTab === 'functions' ? 'active' : ''}`}
              onClick={() => handleTabChange('functions')}
            >
              기능 명세서
            </button>
          </div>
          
          <div className="modal-body">
            {detailsLoading ? (
              <div className="modal-loading">데이터를 불러오는 중...</div>
            ) : !projectDetails ? (
              <div className="modal-error">프로젝트 상세 정보를 불러올 수 없습니다.</div>
            ) : (
              <>
                {activeTab === 'info' && (
                  <div className="modal-tab-content">
                    {/* 소속 기관 및 프로젝트명 */}
                    <div className="project-header">
                      <div className="project-agency">{rfpData?.pro_agency || '-'}</div>
                      <div className="project-title">{rfpData?.pro_name || selectedProject?.name}</div>
                    </div>
                    
                    {/* 예상 견적 및 기간 카드 */}
                    <div className="project-info-cards">
                      <div className="info-card">
                        <div className="info-card-header">
                          <h4>예상 견적</h4>
                        </div>
                        <div className="info-card-body">
                          <p className="info-value">약 <span>{rfpData?.pro_budget || '-'}</span>만원</p>
                          <p className="info-sub">희망 견적: {rfpData?.expected_budget || '정보 없음'} 만원</p>
                        </div>
                      </div>
                      
                      <div className="info-card">
                        <div className="info-card-header">
                          <h4>예상 기간</h4>
                        </div>
                        <div className="info-card-body">
                          <p className="info-value">약 <span>{rfpData?.pro_period || '-'}</span> 미만</p>
                          <p className="info-sub">희망 기간: {rfpData?.expected_period || '정보 없음'} 개월</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* 프로젝트 상세 정보 */}
                    <div className="info-details">
                      <div className="detail-row">
                        <span className="detail-label">프로젝트 ID:</span>
                        <span className="detail-value">{projectDetails.id}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">소유자:</span>
                        <span className="detail-value">{projectDetails.owner_name || projectDetails.owner_id || '정보 없음'}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">상태:</span>
                        <span className={`status-badge status-${projectDetails.status?.toLowerCase() || 'active'}`}>
                          {projectDetails.status || '활성'}
                        </span>
                      </div>
                      {projectDetails.created_at && (
                        <div className="detail-row">
                          <span className="detail-label">생성일:</span>
                          <span className="detail-value">{new Date(projectDetails.created_at).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {activeTab === 'requirements' && (
                  <div className="modal-tab-content">
                    {apiErrors.projectDetails && (
                      <div className="api-error-message">
                        프로젝트 상세 정보를 불러오는 중 오류가 발생했습니다: {apiErrors.projectDetails}
                      </div>
                    )}
                    
                    {/* 서비스 요구사항 */}
                    {rfpData?.pro_service && (
                      <div className="requirement-card">
                        <div className="requirement-header">
                          <h4>서비스 요구사항</h4>
                        </div>
                        <div className="requirement-body">
                          {rfpData?.pro_service.split('\n').map((line, index) => (
                            <p key={index}>{line || '-'}</p>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* 산출물 */}
                    {rfpData?.pro_output && (
                      <div className="requirement-card">
                        <div className="requirement-header">
                          <h4>필요 산출물</h4>
                        </div>
                        <div className="requirement-body">
                          {rfpData?.pro_output.split('\n').map((line, index) => (
                            <p key={index}>{line || '-'}</p>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* 레퍼런스 */}
                    {rfpData?.pro_reference && (
                      <div className="requirement-card">
                        <div className="requirement-header">
                          <h4>동종업체 레퍼런스</h4>
                        </div>
                        <div className="requirement-body">
                          <div className="reference-info">
                            <img src="/static/media/plus.5bb7252a.svg" alt="참고" />
                            <span>참고 하세요!</span>
                          </div>
                          <ul className="reference-list">
                            <li>
                              <a href={`https://${rfpData?.pro_reference}`} target="_blank" rel="noopener noreferrer">
                                <img src="/static/media/clip.9440e159.svg" alt="링크" />
                                <span>{rfpData?.pro_reference}</span>
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    )}
                    
                    {!rfpData?.pro_service && !rfpData?.pro_output && !rfpData?.pro_reference && (
                      <div className="no-data-message">
                        요구사항 및 산출물 정보가 없습니다.
                      </div>
                    )}
                  </div>
                )}
                
                {activeTab === 'functions' && (
                  <div className="modal-tab-content">
                    <h3 className="tab-section-title">기능 명세서</h3>
                    
                    {apiErrors.iaData && (
                      <div className="api-error-message">
                        IA 데이터를 불러오는 중 오류가 발생했습니다: {apiErrors.iaData}
                      </div>
                    )}
                    
                    {hasIaData ? (
                      <div className="ia-table-container">
                        <table className="ia-table">
                          <thead>
                            <tr>
                              <th>대분류</th>
                              <th>중분류</th>
                              <th>소분류</th>
                              <th>기능</th>
                              <th>설명</th>
                            </tr>
                          </thead>
                          <tbody>
                            {iaData.map((item, index) => (
                              <tr key={index}>
                                <td>{item.depth1 || '-'}</td>
                                <td>{item.depth2 || '-'}</td>
                                <td>{item.depth3 || '-'}</td>
                                <td>{item.depth4 || '-'}</td>
                                <td>{item.description || '-'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="no-data-message">
                        기능 명세서 데이터가 없습니다.
                      </div>
                    )}
                    
                    {apiErrors.funcDesc && (
                      <div className="api-error-message">
                        기능 설명을 불러오는 중 오류가 발생했습니다: {apiErrors.funcDesc}
                      </div>
                    )}
                    
                    {hasFuncDesc && (
                      <div className="func-desc">
                        <h4>기능 설명</h4>
                        <p>{getFuncDescText()}</p>
                      </div>
                    )}
                    
                    {apiErrors.wbsData && (
                      <div className="api-error-message">
                        WBS 데이터를 불러오는 중 오류가 발생했습니다: {apiErrors.wbsData}
                      </div>
                    )}
                    
                    {hasWbsData && (
                      <div className="wbs-section">
                        <h4>작업 분할 구조 (WBS)</h4>
                        <div className="wbs-items">
                          {wbsData.map((task, index) => (
                            <div key={index} className="wbs-item">
                              <div className="wbs-item-header">
                                <span className="wbs-title">{task.name || task.task_name || '작업 항목'}</span>
                                <span className="wbs-progress">{task.progress || 0}%</span>
                              </div>
                              <div className="wbs-timeline">
                                <div className="wbs-time">
                                  <span>시작: {task.start_date || task.startDate || '정보 없음'}</span>
                                  <span>종료: {task.end_date || task.endDate || '정보 없음'}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {!hasIaData && !hasFuncDesc && !hasWbsData && (
                      <div className="no-data-message">
                        기능 명세서에 관련된 데이터가 없습니다.
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="admin-loading">데이터를 불러오는 중...</div>;
  }

  if (error) {
    return <div className="admin-error">{error}</div>;
  }

  return (
    <div className="projects-page-container">
      <h2 className="page-title">프로젝트 목록</h2>
      
      <div className="admin-table-container">
        {projects.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>프로젝트명</th>
                <th>소유자</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr 
                  key={project.id} 
                  onClick={() => handleProjectClick(project)}
                  className="clickable-row"
                >
                  <td style={{ color: '#333' }}>{project.id}</td>
                  <td style={{ color: '#333', fontWeight: '500' }}>{project.name}</td>
                  <td style={{ color: '#333' }}>{project.owner_name || project.owner_id}</td>
                  <td>
                    <span className={`status-badge status-${project.status?.toLowerCase() || 'active'}`}>
                      {project.status || '활성'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-data-message">등록된 프로젝트가 없습니다.</p>
        )}
      </div>

      {/* 프로젝트 상세 모달 */}
      <ProjectDetailsModal />
    </div>
  );
};

export default ProjectsPage; 