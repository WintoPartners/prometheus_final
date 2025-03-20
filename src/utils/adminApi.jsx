import axios from 'axios';

// 환경에 따른 API URL 설정
console.log('현재 REACT_APP_STAGE 값:', process.env.REACT_APP_STAGE);
console.log('현재 REACT_APP_API_ENDPOINT 값:', process.env.REACT_APP_API_ENDPOINT);

const API_URL = process.env.REACT_APP_STAGE !== 'development' 
  ? `${process.env.REACT_APP_API_ENDPOINT}` 
  : 'http://localhost:8080';

console.log(`Admin API configured with URL: ${API_URL}`);

const adminApi = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  }
});

// CORS 설정을 위한 withCredentials 옵션 추가
adminApi.defaults.withCredentials = true;

// 요청 인터셉터를 추가하여 모든 요청에 토큰 추가
adminApi.interceptors.request.use(config => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// 응답 인터셉터를 추가하여 401 에러 처리 (토큰 만료 등)
adminApi.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('adminToken');
      // 필요시 로그아웃 처리 또는 토큰 갱신 로직
      window.location.href = '/admin';
    }
    return Promise.reject(error);
  }
);

export default adminApi; 