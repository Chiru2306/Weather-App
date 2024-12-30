import React from "react";

const DailyForecast = ({ forecast }) => {
  const dailyData = forecast.list.filter((_, idx) => idx % 8 === 0);

  return (
    <div className="daily-forecast">
      <h3>5-Day Forecast</h3>
      <div className="forecast-cards">
        {dailyData.map((day, idx) => (
          <div key={idx} className="forecast-card">
            <p>{new Date(day.dt * 1000).toLocaleDateString()}</p>
            <img
              src={`http://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
              alt={day.weather[0].description}
            />
            <p>{day.weather[0].description}</p>
            <p>High: {day.main.temp_max}°</p>
            <p>Low: {day.main.temp_min}°</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyForecast;
