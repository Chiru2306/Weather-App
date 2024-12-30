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
import logo from './images/Logo.png';
import "./App.css";

const API_KEY = process.env.REACT_APP_API_KEY;

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [city, setCity] = useState("Hyderabad");
  const [unit, setUnit] = useState("metric");
  const [background, setBackground] = useState("");
  const [typewriterText, setTypewriterText] = useState("");
  const [loading, setLoading] = useState(false); // State to manage loading
  const [popupMessage, setPopupMessage] = useState(""); // State for the popup message

  const fullText = "  Get accurate & latest weather updates..";
  const speed = 100;

  useEffect(() => {
    let i = 0;
    const intervalId = setInterval(() => {
      if (i < fullText.length) {
        setTypewriterText((prev) => prev + fullText.charAt(i));
        i++;
      } else {
        clearInterval(intervalId); // Clear the interval when done
      }
    }, speed);

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  // Fetch weather data
  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true); // Start loading
      setPopupMessage(""); // Clear any previous popup messages
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
        if (error.response && error.response.data && error.response.data.message === "city not found") {
          setPopupMessage("City not found");
        } else {
          console.error("Error fetching weather data:", error);
        }
      } finally {
        setLoading(false); // Stop loading
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
      {/* Loading Overlay */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      )}

      {/* Popup for error messages */}
      {popupMessage && (
        <div className="popup-overlay">
          <div className="popup-content">
            <p>{popupMessage}</p>
            <button onClick={() => setPopupMessage("")}>OK</button>
          </div>
        </div>
      )}

      <div className="NavBar">
        <img src={logo} alt="logo" height="100px" />
      </div>
      <div className="DisText">
        <h2>{typewriterText}</h2>
      </div>
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
