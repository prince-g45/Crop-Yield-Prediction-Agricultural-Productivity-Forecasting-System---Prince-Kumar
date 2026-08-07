import { useEffect, useState } from "react";
import {
  Cloud,
  Droplets,
  Wind,
  Thermometer,
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

      }

    );

  }, []);

  if (!weather) return null;

  const current = weather.current;
  const forecast = weather.forecast.forecastday;

  return (

    <div className="weather-dropdown">

      {/* Weather Summary */}

      <div
        className="weather-summary"
        onClick={() => setOpen(!open)}
      >

        <img
          src={`https:${current.condition.icon}`}
          alt={current.condition.text}
        />

        <div>

          <strong>

            {Math.round(current.temp_c)}°C

          </strong>

          <small>

            {weather.location.name}

          </small>

        </div>

      </div>

      {/* Popup */}

      {

        open && (

          <div className="weather-popup">

            <h3>

              🌤 Current Weather

            </h3>

            <p>

              📍 {weather.location.name}

            </p>

            <div className="weather-row">

              <Thermometer size={18} />

              <span>

                Temperature : {current.temp_c}°C

              </span>

            </div>

            <div className="weather-row">

              <Droplets size={18} />

              <span>

                Humidity : {current.humidity}%

              </span>

            </div>

            <div className="weather-row">

              <Wind size={18} />

              <span>

                Wind : {current.wind_kph} km/h

              </span>

            </div>

            <div className="weather-row">

              <Cloud size={18} />

              <span>

                {current.condition.text}

              </span>

            </div>

            <div className="recommendation">

              🌱 Good weather for farming.

            </div>

            <hr />

            <h4 className="forecast-title">

              7-Day Forecast

            </h4>

            <div className="forecast-list">

              {

                forecast.map((day) => (

                  <div
                    className="forecast-item"
                    key={day.date}
                  >

                    <span>

                      {

                        new Date(day.date)
                          .toLocaleDateString(
                            "en-US",
                            {
                              weekday: "short",
                            }
                          )

                      }

                    </span>

                    <img
                      src={`https:${day.day.condition.icon}`}
                      alt=""
                    />

                    <span>

                      {day.day.avgtemp_c}°C

                    </span>

                  </div>

                ))

              }

            </div>

          </div>

        )

      }

    </div>

  );

}

export default WeatherDropdown;