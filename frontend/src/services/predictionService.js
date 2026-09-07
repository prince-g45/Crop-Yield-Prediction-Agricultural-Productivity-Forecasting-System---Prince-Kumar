import axios from "axios";

const API = "http://98.84.152.196:8000/api/v1/prediction";

// ==========================================
// Authentication Headers
// ==========================================

const getHeaders = () => {

  const token = localStorage.getItem("access_token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};


// ==========================================
// Predict Yield
// ==========================================

export const predictYield = async (data) => {

  const response = await axios.post(
    `${API}/predict`,
    data,
    getHeaders()
  );

  return response.data;
};


// ==========================================
// Prediction Metadata
// ==========================================

export const getPredictionMetadata = async () => {

  const response = await axios.get(
    `${API}/metadata`,
    getHeaders()
  );

  return response.data;
};


// ==========================================
// Farmer Prediction History
// ==========================================

export const getPredictionHistory = async () => {

  const response = await axios.get(
    `${API}/history`,
    getHeaders()
  );

  return response.data;
};


// ==========================================
// Admin - All Prediction History
// ==========================================

export const getAdminPredictionHistory = async () => {

  const response = await axios.get(
    `${API}/admin/history`,
    getHeaders()
  );

  return response.data;
};


// ==========================================
// Delete Prediction
// ==========================================

export const deletePrediction = async (predictionId) => {

  const response = await axios.delete(
    `${API}/${predictionId}`,
    getHeaders()
  );

  return response.data;
};
