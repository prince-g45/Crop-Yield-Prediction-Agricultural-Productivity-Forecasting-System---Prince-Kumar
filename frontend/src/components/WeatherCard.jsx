import { useEffect, useState } from "react";
import { getWeatherByCoordinates } from "../services/weatherService";

function WeatherCard() {

  const [weather, setWeather] = useState(null);

  useEffect(() => {

    navigator.geolocation.getCurrentPosition(

      async(position)=>{

        try{

          const data = await getWeatherByCoordinates(

            position.coords.latitude,

            position.coords.longitude

          );

          setWeather(data);

        }

        catch(error){

          console.log(error);

        }

      }

    );

  }, []);

  if(!weather){

    return(

      <div className="weather-card">

        Loading weather...

      </div>

    );

  }

  return(

    <div className="weather-card">

      <h2>Current Weather</h2>

      <div className="weather-grid">

        <div>

          <h4>Location</h4>

          <p>{weather.location.name}</p>

        </div>

        <div>

          <h4>Temperature</h4>

          <p>{weather.current.temp_c} °C</p>

        </div>

        <div>

          <h4>Humidity</h4>

          <p>{weather.current.humidity}%</p>

        </div>

        <div>

          <h4>Condition</h4>

          <p>{weather.current.condition.text}</p>

        </div>

      </div>

    </div>

  );

}

export default WeatherCard;