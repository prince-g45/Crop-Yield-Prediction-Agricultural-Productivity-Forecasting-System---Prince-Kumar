import axios from "axios";

// ======================================
// Base URL
// ======================================

const API = "http://localhost:8000/api/v1/prediction";

// ======================================
// Common Headers
// ======================================

const getHeaders = () => {

  const token = localStorage.getItem("access_token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

};

// ======================================
// Predict Crop Yield
// ======================================

export const predictYield = async (data) => {

  const response = await axios.post(
    `${API}/predict`,
    data,
    getHeaders()
  );

  return response.data;

};

// ======================================
// Get Metadata
// ======================================

export const getPredictionMetadata = async () => {

  const response = await axios.get(
    `${API}/metadata`,
    getHeaders()
  );

  return response.data;

};

// ======================================
// Get Prediction History
// ======================================

export const getPredictionHistory = async () => {

  const response = await axios.get(
    `${API}/history`,
    getHeaders()
  );

  return response.data;

};

// ======================================
// Delete Prediction
// ======================================

export const deletePrediction = async (predictionId) => {

  const response = await axios.delete(
    `${API}/${predictionId}`,
    getHeaders()
  );

  return response.data;

};