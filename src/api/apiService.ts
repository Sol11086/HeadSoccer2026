import axios from 'axios';

const apiService = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`
});

// Función "interceptor" que se ejecuta ANTES de que se envíe cualquier petición
apiService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiService;