import React, { useState, useEffect } from "react";
import axios from "axios";
import WeatherCard from "./components/WeatherCard";
import SearchBar from "./components/SearchBar";
import DailyForecast from "./components/DailyForecast";
import HourlyForecast from "./components/HourlyForecast";
import clearImage from './images/clear.jpg';
import cloudyImage from './images/cloudy.webp';
import hazeImage from './images/haze.jpg';
import rainyImage from './images/rainy.jpg';
import snowyImage from './images/snowy.jpg';
import defaultImage from './images/default.png';
import "./App.css";

const API_KEY = "06bdd04b3a98c170795cc6551e72521e";

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [city, setCity] = useState("Hyderabad");
  const [unit, setUnit] = useState("metric");
  const [background, setBackground] = useState("");

  // Fetch weather data
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const currentWeather = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${API_KEY}`
        );
        const forecast = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${unit}&appid=${API_KEY}`
        );
        setWeatherData(currentWeather.data);
        setForecastData(forecast.data);
        updateBackground(currentWeather.data.weather[0].main);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    }; 

    fetchWeather();
  }, [city, unit]);

  // Update background image based on weather condition
  const updateBackground = (condition) => {
    switch (condition.toLowerCase()) {
      case "clear":
        setBackground(clearImage);
        break;
      case "clouds":
        setBackground(cloudyImage);
        break;
      case "rain":
        setBackground(rainyImage);
        break;
      case "snow":
        setBackground(snowyImage);
        break;
      case "haze":
        setBackground(hazeImage);
        break;
      default:
        setBackground(defaultImage);
        break;
    }
  };

  return (
    <div
      className="app"
      style={{
        backgroundImage: `url(${background})`,
      }}
    >
      <SearchBar setCity={setCity} />
      {weatherData && (
        <WeatherCard
          weather={weatherData}
          unit={unit}
          setUnit={setUnit}
        />
      )}
        {forecastData && <DailyForecast forecast={forecastData} />}
      
        {forecastData && <HourlyForecast forecast={forecastData} />}
    </div>
  );
};

export default App; 
