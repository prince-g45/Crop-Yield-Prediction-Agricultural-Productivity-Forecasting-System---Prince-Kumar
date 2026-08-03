import api from "./api";

// Create Farm
export const createFarm = async (farmData) => {
  const response = await api.post("/farms", farmData);
  return response.data;
};

// Get All Farms
export const getFarms = async () => {
  const response = await api.get("/farms");
  return response.data;
};

// Update Farm
export const updateFarm = async (id, farmData) => {
  const response = await api.put(`/farms/${id}`, farmData);
  return response.data;
};

// Delete Farm
export const deleteFarm = async (id) => {
  const response = await api.delete(`/farms/${id}`);
  return response.data;
};