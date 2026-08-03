import api from "./api";

export const predictYield = async (predictionData) => {

    const response = await api.post(
        "/predict",
        predictionData
    );

    return response.data;

};