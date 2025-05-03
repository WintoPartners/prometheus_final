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

  const fetchProjectDetails = async (projectId) => {
    try {
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
      return data[0] || null;
    } catch (error) {
      console.error('프로젝트 상세 정보 로딩 실패:', error);
      return null;
    }
  };

  const fetchIaData = async (projectId) => {
    try {
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
      
      return await response.json();
    } catch (error) {
      console.error('IA 데이터 로딩 실패:', error);
      return [];
    }
  };

  const fetchWbsData = async (projectId) => {
    try {
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
      
      return await response.json();
    } catch (error) {
      console.error('WBS 데이터 로딩 실패:', error);
      return [];
    }
  };

  const fetchFuncDesc = async (projectId) => {
    try {
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
      return data[0] || '';
    } catch (error) {
      console.error('기능 설명 로딩 실패:', error);
      return '';
    }
  };

  const handleProjectClick = async (project) => {
    setSelectedProject(project);
    setDetailsLoading(true);
    setModalOpen(true);
    setActiveTab('info');
    
    try {
      // 먼저 현재 선택된 프로젝트의 기본 정보를 모달에 표시
      setProjectDetails(project);
      
      // 모든 데이터를 병렬로 가져오기
      const [detailsData, iaResult, wbsResult, funcDescResult] = await Promise.all([
        fetchProjectDetails(project.id),
        fetchIaData(project.id),
        fetchWbsData(project.id),
        fetchFuncDesc(project.id)
      ]);
      
      if (detailsData) {
        setProjectDetails({
          ...project,
          ...detailsData
        });
      }
      
      setIaData(iaResult);
      setWbsData(wbsResult);
      setFuncDesc(funcDescResult);
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
  };

  // 모달 컴포넌트
  const ProjectDetailsModal = () => {
    if (!modalOpen) return null;

    return (
      <div className="modal-overlay" onClick={closeModal}>
        <div className="project-detail-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>{projectDetails?.name || projectDetails?.pro_name || '프로젝트 상세'}</h3>
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
                    <div className="project-summary">
                      <div className="summary-item owner">
                        <h4>소유자</h4>
                        <p>{projectDetails.owner_name || projectDetails.owner_id || '정보 없음'}</p>
                      </div>
                      <div className="summary-item status">
                        <h4>상태</h4>
                        <span className={`status-badge status-${projectDetails.status?.toLowerCase() || 'active'}`}>
                          {projectDetails.status || '활성'}
                        </span>
                      </div>
                      <div className="summary-item created">
                        <h4>생성일</h4>
                        <p>{projectDetails.created_at ? new Date(projectDetails.created_at).toLocaleDateString() : '정보 없음'}</p>
                      </div>
                    </div>
                    
                    <div className="project-info-cards">
                      <div className="info-card">
                        <div className="info-card-header">
                          <h4>예상 견적</h4>
                        </div>
                        <div className="info-card-body">
                          <p className="info-value">{(projectDetails.pro_budget || projectDetails.budget || 0)}만원</p>
                          <p className="info-sub">희망 견적: {projectDetails.expected_budget || '정보 없음'} 만원</p>
                        </div>
                      </div>
                      
                      <div className="info-card">
                        <div className="info-card-header">
                          <h4>예상 기간</h4>
                        </div>
                        <div className="info-card-body">
                          <p className="info-value">{(projectDetails.pro_period || projectDetails.period || '정보 없음')}</p>
                          <p className="info-sub">희망 기간: {projectDetails.expected_period || '정보 없음'} 개월</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="info-details">
                      <div className="detail-row">
                        <span className="detail-label">프로젝트 ID:</span>
                        <span className="detail-value">{projectDetails.id}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">기관:</span>
                        <span className="detail-value">{projectDetails.pro_agency || projectDetails.agency || '정보 없음'}</span>
                      </div>
                      {projectDetails.description && (
                        <div className="detail-row">
                          <span className="detail-label">설명:</span>
                          <p className="detail-value description">{projectDetails.description}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {activeTab === 'requirements' && (
                  <div className="modal-tab-content">
                    {projectDetails.pro_service && (
                      <div className="requirement-card">
                        <div className="requirement-header">
                          <h4>서비스 요구사항</h4>
                        </div>
                        <div className="requirement-body">
                          {projectDetails.pro_service.split('\n').map((line, index) => (
                            <p key={index}>{line}</p>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {projectDetails.pro_output && (
                      <div className="requirement-card">
                        <div className="requirement-header">
                          <h4>필요 산출물</h4>
                        </div>
                        <div className="requirement-body">
                          {projectDetails.pro_output.split('\n').map((line, index) => (
                            <p key={index}>{line}</p>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {projectDetails.pro_reference && (
                      <div className="requirement-card">
                        <div className="requirement-header">
                          <h4>동종업체 레퍼런스</h4>
                        </div>
                        <div className="requirement-body">
                          <a href={`https://${projectDetails.pro_reference}`} target="_blank" rel="noopener noreferrer">
                            {projectDetails.pro_reference}
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {!projectDetails.pro_service && !projectDetails.pro_output && !projectDetails.pro_reference && (
                      <div className="no-data-message">
                        요구사항 및 산출물 정보가 없습니다.
                      </div>
                    )}
                  </div>
                )}
                
                {activeTab === 'functions' && (
                  <div className="modal-tab-content">
                    <h3 className="tab-section-title">기능 명세서</h3>
                    
                    {iaData && iaData.length > 0 ? (
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
                    
                    {funcDesc && (
                      <div className="func-desc">
                        <h4>기능 설명</h4>
                        <p>{funcDesc.description || funcDesc}</p>
                      </div>
                    )}
                    
                    {wbsData && wbsData.length > 0 && (
                      <div className="wbs-section">
                        <h4>작업 분할 구조 (WBS)</h4>
                        <div className="wbs-items">
                          {wbsData.map((task, index) => (
                            <div key={index} className="wbs-item">
                              <div className="wbs-item-header">
                                <span className="wbs-title">{task.name || '작업 항목'}</span>
                                <span className="wbs-progress">{task.progress || 0}%</span>
                              </div>
                              <div className="wbs-timeline">
                                <div className="wbs-time">
                                  <span>시작: {task.start_date || '정보 없음'}</span>
                                  <span>종료: {task.end_date || '정보 없음'}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
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