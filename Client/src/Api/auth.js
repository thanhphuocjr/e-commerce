import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Token

export const saveToken = (token) => {
  sessionStorage.setItem('accessToken', token);
};
export const saveRefreshToken = (token) => {
  localStorage.setItem('refreshToken', token);
};

export const getToken = () => {
  return sessionStorage.getItem('accessToken');
};
export const getUserInformation = () => {
  const user = sessionStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const getRefreshToken = () => {
  return localStorage.getItem('refreshToken');
};

export const removeToken = () => {
  sessionStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  sessionStorage.removeItem('user');
};

// API calls

// Replace apiRegister function in auth.js with this:
export const apiRegister = async (userData) => {
  try {
    console.log('Making registration request with data:', userData);
    console.log('Request URL:', API_BASE_URL + '/users/register');

    const response = await api.post('/users/register', {
      fullName: userData.fullName,
      email: userData.email,
      password: userData.password,
      confirmPassword: userData.password,
    });

    console.log('Registration response:', response);
    console.log('Registration response data:', response.data);
    return response.data;
  } catch (error) {
    console.error('API Register error:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      fullError: error,
    });
    throw error;
  }
};

// In your apiLogin function in auth.js, add more debugging:
export const apiLogin = async (email, password) => {
  try {
    console.log('Making login request to:', API_BASE_URL + '/users/login');
    const response = await api.post('/users/login', { email, password });
    // console.log('Login response:', response);

    return response.data;
  } catch (error) {
    console.error('API Login error:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
    });
    throw error;
  }
};

export const apiRefreshToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error('No refresh token found');
  const response = await api.post('/users/refresh', { refreshToken });
  return response.data;
};

export const apiForgotPassword = async (email) => {
  const response = await api.post('/users/forgot-password', { email });
  return response.data;
};

export const apiResetPassword = async (token, newPassword, confirmPassword) => {
  const response = await api.post('/users/reset-password', {
    token,
    newPassword,
    confirmPassword,
  });
  return response.data;
};

export const apiGetProfile = async () => {
  const response = await api.get('/users/profile');
  return response.data;
};

export const apiChangePassword = async (
  currentPassword,
  newPassword,
  confirmPassword
) => {
  const response = await api.patch('/users/change-password', {
    currentPassword,
    newPassword,
    confirmPassword,
  });
  return response.data;
};

export const apiLogout = async () => {
  try {
    const refreshToken = getRefreshToken(); // lấy refreshToken từ storage
    const response = await api.post('/users/logout', { refreshToken });
    console.log('Logout response:', response);
    removeToken();
  } catch (error) {
    console.error('Logout failed:', error);
    removeToken();
    throw error;
  }
};

// Interceptors

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    console.log('Chay den prom');
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    console.log('originalRequest :', originalRequest);

    const isLoginRequest =
      originalRequest.url === '/users/login' ||
      originalRequest.url.endsWith('/users/login') ||
      (originalRequest.baseURL &&
        (originalRequest.baseURL + originalRequest.url).includes(
          '/users/login'
        ));

    if (error.response && error.response.status === 401 && isLoginRequest) {
      console.log('Bo qua loi 401 vi di vao login!!!');
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('Da di vao tinh trang 401 roi nhe!');
      if (isRefreshing) {
        console.log('Dang chay refreshing');
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          console.log('Da chay duoc den buoc .then');
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log('Try lan dau de lay token!');
        const res = await apiRefreshToken();

        console.log('Try qua apiRefreshTOKEN dau de lay token! ', res);

        const newAccessToken = res.data.accessToken;
        const newRefreshToken = res.data.refreshToken;

        saveToken(newAccessToken);
        saveRefreshToken(newRefreshToken);

        processQueue(null, newAccessToken);
        isRefreshing = false;

        originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;
        console.log('Chay dc den cuoi try.');
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        isRefreshing = false;
        removeToken();
        window.location.href = '/signin';
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

// ======================
// Logout
// ======================
