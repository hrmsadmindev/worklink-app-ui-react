import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('hrms_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('hrms_token');
      localStorage.removeItem('hrms_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Helper function to handle API responses
export const handleApiResponse = (response) => {
  if (response.data) {
    return {
      success: true,
      data: response.data,
      message: response.data.message || 'Operation successful'
    };
  }
  return {
    success: false,
    error: 'No data received'
  };
};

// Helper function to handle API errors
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    return {
      success: false,
      error: error.response.data?.message || 'Server error occurred',
      status: error.response.status
    };
  } else if (error.request) {
    // Request made but no response received
    return {
      success: false,
      error: 'Network error - please check your connection'
    };
  } else {
    // Something else happened
    return {
      success: false,
      error: error.message || 'An unexpected error occurred'
    };
  }
};

// Generic CRUD helpers
export const apiGet = async (endpoint) => {
  try {
    const response = await apiClient.get(endpoint);
    return handleApiResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
};

export const apiPost = async (endpoint, data) => {
  try {
    const response = await apiClient.post(endpoint, data);
    return handleApiResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
};

export const apiPut = async (endpoint, data) => {
  try {
    const response = await apiClient.put(endpoint, data);
    return handleApiResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
};

export const apiDelete = async (endpoint) => {
  try {
    const response = await apiClient.delete(endpoint);
    return handleApiResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
};

// File upload helper
export const apiUpload = async (endpoint, file, onProgress = null) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    if (onProgress) {
      config.onUploadProgress = (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      };
    }

    const response = await apiClient.post(endpoint, formData, config);
    return handleApiResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
};

export default apiClient;