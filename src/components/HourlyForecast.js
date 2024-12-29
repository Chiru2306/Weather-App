import React from "react";

const HourlyForecast = ({ forecast }) => {
  const hourlyData = forecast.list.slice(0, 5); // Next 8 data points (~3-hour intervals)

  return (
    <div className="hourly-forecast">
      <h3>Hourly Forecast</h3>
      <div className="forecast-cards">
        {hourlyData.map((hour, idx) => (
          <div key={idx} className="forecast-card">
            <p>{new Date(hour.dt * 1000).toLocaleTimeString()}</p>
            <img
              src={`http://openweathermap.org/img/wn/${hour.weather[0].icon}.png`}
              alt={hour.weather[0].description}
            />
            <p>{hour.weather[0].description}</p>
            <p>{hour.main.temp}°</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HourlyForecast;
