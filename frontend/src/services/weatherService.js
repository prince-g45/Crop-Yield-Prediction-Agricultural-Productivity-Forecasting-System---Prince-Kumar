import axios from "axios";

const API_KEY = "40f9b5a1e24f4599a78151316263107";

// ===========================
// Current Weather
// ===========================

export const getWeatherByCoordinates = async (lat, lon) => {

  const response = await axios.get(

    `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${lat},${lon}`

  );

  return response.data;

};



// ===========================
// 7 Days Weather Forecast
// ===========================

export const getWeatherForecast = async (lat, lon) => {

  const response = await axios.get(

    `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=7&aqi=no&alerts=no`

  );

  return response.data;

};