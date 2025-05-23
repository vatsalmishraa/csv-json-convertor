import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production' ? '/api' : '/api';

export const getDbStatus = async () => {
  try {
    const response = await axios.get(`${API_URL}/status`);
    return response.data;
  } catch (error) {
    console.error('Error fetching database status:', error);
    throw error;
  }
};

export const uploadCsv = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const startTime = performance.now();
    
    const response = await axios.post(`${API_URL}/convert`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    
    const processingTime = Math.round(performance.now() - startTime);
    return { ...response.data, processingTime };
  } catch (error) {
    console.error('Error uploading CSV:', error);
    throw error.response?.data?.error || error.message;
  }
};

export const getSavedRecords = async () => {
  try {
    const response = await axios.get(`${API_URL}/saved-records`);
    return response.data;
  } catch (error) {
    console.error('Error fetching saved records:', error);
    throw error.response?.data?.error || error.message;
  }
};

export const getSavedFiles = async () => {
  try {
    const response = await axios.get(`${API_URL}/saved-files`);
    return response.data;
  } catch (error) {
    console.error('Error fetching saved files:', error);
    throw error.response?.data?.error || error.message;
  }
};

export const getFileData = async (fileId) => {
  try {
    const response = await axios.get(`${API_URL}/file-data/${fileId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching file data:', error);
    throw error.response?.data?.error || error.message;
  }
};
