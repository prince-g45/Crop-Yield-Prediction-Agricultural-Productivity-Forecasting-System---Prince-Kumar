import api from "./api";

// ==========================================
// DASHBOARD
// ==========================================

export const getAdminDashboard = async () => {

  const response =
    await api.get(
      "/admin/dashboard"
    );

  return response.data;

};


// ==========================================
// GET FARMERS
// ==========================================

export const getFarmers = async () => {

  const response =
    await api.get(
      "/admin/farmers"
    );

  return response.data;

};


// ==========================================
// UPDATE FARMER STATUS
// ==========================================

export const updateFarmerStatus =
  async (farmerId) => {

    const response =
      await api.patch(
        `/admin/farmers/${farmerId}/status`
      );

    return response.data;

  };


// ==========================================
// DELETE FARMER
// ==========================================

export const deleteFarmer =
  async (farmerId) => {

    const response =
      await api.delete(
        `/admin/farmers/${farmerId}`
      );

    return response.data;

  };