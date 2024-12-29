import React from "react";
import { FaTemperatureHigh, FaWind } from "react-icons/fa";

const WeatherCard = ({ weather, unit, setUnit }) => {
  const tempUnit = unit === "metric" ? "°C" : "°F";
  const windUnit = unit === "metric" ? "m/s" : "mph";

  return (
    <div className="weather-card">
      <h2>{weather.name}</h2>
      <img
        src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
        alt={weather.weather[0].description}
      />
      <p>{weather.weather[0].description}</p>
      <p>
        <FaTemperatureHigh /> {weather.main.temp} {tempUnit}
      </p>
      <p>
        High: {weather.main.temp_max} {tempUnit} | Low: {weather.main.temp_min}{" "}
        {tempUnit}
      </p>
      <p>Humidity: {weather.main.humidity}%</p>
      <p>
        <FaWind /> {weather.wind.speed} {windUnit}
      </p>
      <button onClick={() => setUnit(unit === "metric" ? "imperial" : "metric")}>
        Switch to {unit === "metric" ? "Fahrenheit" : "Celsius"}
      </button>
    </div>
  );
};

export default WeatherCard;
