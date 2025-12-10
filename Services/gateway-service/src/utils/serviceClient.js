import axios from 'axios';

export class ServiceClient {
  constructor(baseURL) {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  setAuthToken(token) {
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  clearAuthToken() {
    delete this.client.defaults.headers.common['Authorization'];
  }

  async get(path, config = {}) {
    try {
      const response = await this.client.get(path, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async post(path, data, config = {}) {
    try {
      const response = await this.client.post(path, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async put(path, data, config = {}) {
    try {
      const response = await this.client.put(path, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async delete(path, config = {}) {
    try {
      const response = await this.client.delete(path, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  handleError(error) {
    if (error.response) {
      return {
        status: error.response.status,
        message: error.response.data?.message || 'Service error',
        data: error.response.data,
      };
    }

    if (error.request) {
      return {
        status: 503,
        message: 'Service unavailable',
      };
    }

    return {
      status: 500,
      message: error.message,
    };
  }
}
