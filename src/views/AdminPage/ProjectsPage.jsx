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

  const handleProjectClick = async (project) => {
    setSelectedProject(project);
    setDetailsLoading(true);
    setModalOpen(true);
    
    try {
      // 프로젝트 상세 정보 가져오기
      const response = await adminApi.get(`/admin/projects/${project.id}`);
      setProjectDetails(response.data.data);
    } catch (err) {
      console.error('프로젝트 상세 정보 로딩 실패:', err);
      setError('프로젝트 상세 정보를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setDetailsLoading(false);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedProject(null);
    setProjectDetails(null);
  };

  // 모달 컴포넌트
  const ProjectDetailsModal = () => {
    if (!modalOpen) return null;

    return (
      <div className="modal-overlay" onClick={closeModal}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>{selectedProject?.name || '프로젝트 상세'}</h3>
            <button className="close-button" onClick={closeModal}>×</button>
          </div>
          
          <div className="modal-body">
            {detailsLoading ? (
              <div className="modal-loading">데이터를 불러오는 중...</div>
            ) : projectDetails ? (
              <div className="project-details">
                <div className="detail-row">
                  <span className="detail-label">프로젝트 ID:</span>
                  <span className="detail-value">{projectDetails.id}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">프로젝트명:</span>
                  <span className="detail-value">{projectDetails.name}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">소유자:</span>
                  <span className="detail-value">{projectDetails.owner_name || projectDetails.owner_id}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">상태:</span>
                  <span className={`status-badge status-${projectDetails.status?.toLowerCase() || 'active'}`}>
                    {projectDetails.status || '활성'}
                  </span>
                </div>
                {projectDetails.description && (
                  <div className="detail-row">
                    <span className="detail-label">설명:</span>
                    <p className="detail-value description">{projectDetails.description}</p>
                  </div>
                )}
                {projectDetails.created_at && (
                  <div className="detail-row">
                    <span className="detail-label">생성일:</span>
                    <span className="detail-value">{new Date(projectDetails.created_at).toLocaleString()}</span>
                  </div>
                )}
                {/* 프로젝트에 관련된 추가 정보 표시 */}
                {projectDetails.budget && (
                  <div className="detail-row">
                    <span className="detail-label">예산:</span>
                    <span className="detail-value">{projectDetails.budget}만원</span>
                  </div>
                )}
                {projectDetails.period && (
                  <div className="detail-row">
                    <span className="detail-label">기간:</span>
                    <span className="detail-value">{projectDetails.period}</span>
                  </div>
                )}
                {projectDetails.agency && (
                  <div className="detail-row">
                    <span className="detail-label">기관:</span>
                    <span className="detail-value">{projectDetails.agency}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="modal-error">프로젝트 상세 정보를 불러올 수 없습니다.</div>
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