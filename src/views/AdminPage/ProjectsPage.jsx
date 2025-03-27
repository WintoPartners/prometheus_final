import React, { useState, useEffect } from 'react';
import adminApi from '../../utils/adminApi';
import './AdminPage.css';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
                <tr key={project.id}>
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
    </div>
  );
};

export default ProjectsPage; 