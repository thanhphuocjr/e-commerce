import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT } from './config';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const shouldRetry = (error) => {
  const status = error?.response?.status;
  return !status || status === 502 || status === 503 || status === 504;
};

const getWithRetry = async (url, config = {}, maxAttempts = 4) => {
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await api.get(url, config);
    } catch (error) {
      lastError = error;

      if (!shouldRetry(error) || attempt === maxAttempts) {
        break;
      }

      await wait(300 * attempt);
    }
  }

  throw lastError;
};

const getPagination = (pagination, fallbackLimit = 12) => ({
  page: pagination?.page || 1,
  limit: pagination?.limit || fallbackLimit,
  total: pagination?.total || 0,
  totalPages: pagination?.totalPages || 1,
});

const getListResponse = (response, fallbackLimit = 12) => ({
  items: response?.data?.data || [],
  pagination: getPagination(response?.data?.pagination, fallbackLimit),
  summary: response?.data?.summary || null,
  raw: response?.data,
});

export const getProducts = async (params = {}) => {
  const response = await getWithRetry('/products', { params });
  return getListResponse(response, params.limit);
};

export const getProductById = async (id) => {
  const response = await getWithRetry(`/products/${id}`);
  return response?.data?.data || null;
};

export const getSimilarProducts = async (id, limit = 8) => {
  const response = await getWithRetry(`/products/${id}/similar`, {
    params: { limit },
  });

  return response?.data?.data || [];
};

export const getTopRatedProducts = async (limit = 10) => {
  const response = await getWithRetry('/products/top-rated', {
    params: { limit },
  });
  return response?.data?.data || [];
};

export const getNewArrivals = async (limit = 10) => {
  const response = await getWithRetry('/products/new-arrivals', {
    params: { limit },
  });
  return response?.data?.data || [];
};

export const getProductsOnSale = async (params = {}) => {
  const response = await getWithRetry('/products/on-sale', { params });
  return getListResponse(response, params.limit);
};

export const getProductsByCategory = async (categoryId, params = {}) => {
  const response = await getWithRetry(`/categories/${categoryId}/products`, {
    params,
  });

  return getListResponse(response, params.limit);
};

export const getCategories = async () => {
  const response = await getWithRetry('/categories');
  return response?.data?.data || [];
};

export const getProductReviews = async (productId, params = {}) => {
  const response = await getWithRetry(`/reviews/product/${productId}`, {
    params,
  });

  return getListResponse(response, params.limit || 5);
};

export const searchProducts = async (params = {}) => {
  const response = await getWithRetry('/search', { params });
  return getListResponse(response, params.limit);
};

export { API_BASE_URL };
