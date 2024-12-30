import React, { useState, useEffect } from "react";
import axios from "axios";
import WeatherCard from "./components/WeatherCard";
import SearchBar from "./components/SearchBar";
import DailyForecast from "./components/DailyForecast";
import HourlyForecast from "./components/HourlyForecast";
import clearImage from './images/clear.webp';
import cloudyImage from './images/cloudy.webp';
import hazeImage from './images/haze.webp';
import rainyImage from './images/rainy.webp';
import snowyImage from './images/snowy.webp';
import defaultImage from './images/default.webp';
import eyeicon from './images/eyeicon.png';
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
  const [loading, setLoading] = useState(false);
  const [popupMessage, setPopupMessage] = useState(""); 

  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem("watchlist");
    return saved ? JSON.parse(saved) : []; 
  });
  
  const addToWatchlist = (city) => {
    if (!watchlist.includes(city)) {
      const updatedWatchlist = [...watchlist, city];
      setWatchlist(updatedWatchlist);
      localStorage.setItem("watchlist", JSON.stringify(updatedWatchlist));
      setPopupMessage(`Added ${city} to watchlist`);
    } else {
      setPopupMessage(`${city} is already in your watchlist`); 
    }
  };
  
  const removeFromWatchlist = (city) => {
    const updatedWatchlist = watchlist.filter((c) => c !== city);
    setWatchlist(updatedWatchlist);
    localStorage.setItem("watchlist", JSON.stringify(updatedWatchlist));
    setPopupMessage(`Removed ${city} from watchlist`); 
  };  
  
  const handleCityClick = (city) => {
    setCity(city); 
  };
  
  const fullText = "  Get accurate & latest weather updates..";
  const speed = 100;

  useEffect(() => {
    let i = 0;
    const intervalId = setInterval(() => {
      if (i < fullText.length) {
        setTypewriterText((prev) => prev + fullText.charAt(i));
        i++;
      } else {
        clearInterval(intervalId); 
      }
    }, speed);

    return () => clearInterval(intervalId); 
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true); 
      setPopupMessage(""); 
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
        setLoading(false); 
      }
    };

    fetchWeather();
  }, [city, unit]);

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
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      )}

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
        <div className="watchlist-dropdown">
          <button className="watchlist-button">Watchlist
            <img height="10px" width="30px" src={eyeicon} alt=""/>
          </button>
          <div className="watchlist-menu">
            {watchlist.length > 0 ? (
              watchlist.map((city, index) => (
                <div key={index} className="watchlist-item">
                  <span onClick={() => handleCityClick(city)}>{city}</span>
                  <button onClick={() => removeFromWatchlist(city)}>❌</button>
                </div>
              ))
            ) : (
              <p>Your watchlist is empty</p>
            )}
          </div>
        </div>
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
      {weatherData && (
        <button
          className="add-to-watchlist-btn"
          onClick={() => addToWatchlist(city)}
        >
         Add to Watchlist ✙
        </button>
      )}
      {forecastData && <DailyForecast forecast={forecastData} />}
      {forecastData && <HourlyForecast forecast={forecastData} />}
      <p className="FooterText">Crafted with ❤️ in Hyderabad.</p>
    </div>
  );
};

export default App;
