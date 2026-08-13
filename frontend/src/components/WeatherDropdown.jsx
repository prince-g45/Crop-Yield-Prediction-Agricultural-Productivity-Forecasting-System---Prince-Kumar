import { useEffect, useState } from "react";
import {
  Droplets,
  Wind,
  Thermometer,
  MapPin,
} from "lucide-react";

import { getWeatherForecast } from "../services/weatherService";
import "../styles/WeatherDropdown.css";

function WeatherDropdown() {
  const [weather, setWeather] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          const data = await getWeatherForecast(
            latitude,
            longitude
          );

          setWeather(data);
        } catch (error) {
          console.log(error);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);

  if (!weather) return null;

  const current = weather.current;

  // Only show first 3 days
  const forecast = weather.forecast.forecastday.slice(0, 3);

  return (
    <div className="weather-dropdown">

      {/* =========================
          TOP SUMMARY
      ========================== */}

      <button
        className={`weather-summary ${open ? "active" : ""}`}
        onClick={() => setOpen(!open)}
      >
        <img
          src={`https:${current.condition.icon}`}
          alt={current.condition.text}
        />

        <div className="summary-content">
          <strong>
            {Math.round(current.temp_c)}°C
          </strong>

          <span>
            {weather.location.name}
          </span>
        </div>
      </button>


      {/* =========================
          WEATHER POPUP
      ========================== */}

      {open && (
        <div className="weather-popup">

          {/* Header */}

          <div className="weather-popup-header">

            <div>
              <span className="weather-eyebrow">
                CURRENT WEATHER
              </span>

              <h3>
                {weather.location.name}
              </h3>
            </div>

            <div className="location-icon">
              <MapPin size={19} />
            </div>

          </div>


          {/* =========================
              MAIN WEATHER
          ========================== */}

          <div className="weather-main">

            <img
              className="main-weather-icon"
              src={`https:${current.condition.icon}`}
              alt={current.condition.text}
            />

            <div className="temperature-block">

              <div className="main-temperature">
                {current.temp_c.toFixed(1)}
                <span>°C</span>
              </div>

              <div className="weather-condition">
                {current.condition.text}
              </div>

              <div className="feels-like">
                Feels like {current.feelslike_c.toFixed(0)}°
              </div>

            </div>

          </div>


          {/* =========================
              STATS
          ========================== */}

          <div className="weather-stats">

            <div className="weather-stat">

              <Droplets size={18} />

              <div>
                <span>Humidity</span>
                <strong>
                  {current.humidity}%
                </strong>
              </div>

            </div>


            <div className="weather-stat">

              <Wind size={18} />

              <div>
                <span>Wind</span>
                <strong>
                  {current.wind_kph} km/h
                </strong>
              </div>

            </div>


            <div className="weather-stat">

              <Thermometer size={18} />

              <div>
                <span>Feels Like</span>
                <strong>
                  {current.feelslike_c.toFixed(0)}°
                </strong>
              </div>

            </div>

          </div>


          {/* =========================
              FARMING MESSAGE
          ========================== */}

          <div className="farming-message">

            <span className="status-dot"></span>

            <div>
              <strong>
                Good conditions
              </strong>

              <p>
                Suitable for farming activities today.
              </p>
            </div>

          </div>


          {/* =========================
              FORECAST
          ========================== */}

          <div className="forecast-section">

            <div className="forecast-header">
              <h4>
                3-Day Forecast
              </h4>
            </div>


            <div className="forecast-list">

              {forecast.map((day) => (

                <div
                  className="forecast-card"
                  key={day.date}
                >

                  <span className="forecast-day">
                    {new Date(day.date).toLocaleDateString(
                      "en-US",
                      {
                        weekday: "short",
                      }
                    )}
                  </span>


                  <img
                    src={`https:${day.day.condition.icon}`}
                    alt={day.day.condition.text}
                  />


                  <strong>
                    {Math.round(day.day.avgtemp_c)}°
                  </strong>

                </div>

              ))}

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default WeatherDropdown;