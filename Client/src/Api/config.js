const normalizeApiBaseUrl = (url) => {
  const trimmedUrl = (url || '').trim();
  const baseUrl = trimmedUrl || 'http://localhost:5001/api';

  return baseUrl.endsWith('/v1')
    ? baseUrl.replace(/\/v1\/?$/, '')
    : baseUrl.replace(/\/+$/, '');
};

const rawBaseUrl =
  process.env.REACT_APP_GATEWAY_API_URL ||
  process.env.REACT_APP_API_BASE_URL ||
  process.env.REACT_APP_API_URL;

export const API_BASE_URL = normalizeApiBaseUrl(rawBaseUrl);
export const API_TIMEOUT = Number(process.env.REACT_APP_API_TIMEOUT) || 10000;
