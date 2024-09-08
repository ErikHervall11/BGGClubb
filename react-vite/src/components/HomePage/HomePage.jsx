import { useState, useEffect } from "react";
import "./HomePage.css";
import { FaTemperatureArrowUp } from "react-icons/fa6";
import { FaTemperatureArrowDown } from "react-icons/fa6";
import { BsWind } from "react-icons/bs";
import { BsClouds } from "react-icons/bs";
import { FiSunset } from "react-icons/fi";

function HomePage({ isAdmin }) {
  const [roundLimit, setRoundLimit] = useState(8);
  const [isEditing, setIsEditing] = useState(false);
  const [newRoundLimit, setNewRoundLimit] = useState(roundLimit);
  const [weatherData, setWeatherData] = useState([]);

  const apiKey = "XFFERAZ9K18NdW8dS60EHEfWqh8eTARR";
  const lat = 38.01983211871731;
  const lon = -122.52246954832552;

  const url = `https://api.tomorrow.io/v4/weather/forecast?location=${lat},${lon}&apikey=${apiKey}&timesteps=1d&units=imperial`;

  useEffect(() => {
    fetch("/api/settings/round-limit")
      .then((response) => response.json())
      .then((data) => {
        if (data.round_limit) {
          setRoundLimit(data.round_limit);
        }
      })
      .catch((error) => console.error("Error fetching round limit:", error));
  }, []);

  // Fetch Weather Data
  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        // Only grab the daily
        const dailyWeather = data.timelines.daily;
        setWeatherData(dailyWeather);
      })
      .catch((error) => console.error("Error fetching weather data:", error));
  }, [url]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    setNewRoundLimit(e.target.value);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setNewRoundLimit(roundLimit);
  };

  const handleSubmitClick = () => {
    const confirmSubmit = window.confirm(
      "Are you sure you want to update the round limit?"
    );
    if (confirmSubmit) {
      fetch("/api/settings/round-limit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ round_limit: newRoundLimit }),
      })
        .then((response) => response.json())
        .then((data) => {
          setRoundLimit(data.round_limit);
          setIsEditing(false);
        })
        .catch((error) => console.error("Error updating round limit:", error));
    }
  };

  return (
    <div className="home-page">
      <div className="header-top">
        <img className="scorecard-map" src="./Mcginnisnoback.png" alt="" />
        <h1 className="header">BAD GIRLS GOLF CLUB</h1>
        <img
          className="scorecard-header"
          src="./McginnisGolfCourseSCORESECTION.png"
          alt=""
        />
      </div>
      <div className="google-sheet-link">
        <a
          className="google-sheet"
          href="https://docs.google.com/spreadsheets/u/0/d/1PYIu64VIR6y3FHJAov7bNp7WasOUm0sNFyKYWRyVs3g/htmlview?pli=1"
          target="#"
        >
          Schedule Your Next Round!
        </a>
      </div>

      {/* Weather Forecast Section */}
      <div className="weather-section">
        {/* <h3>Weather Forecast</h3> */}
        <div className="weather-container">
          {weatherData.length > 0 ? (
            weatherData.map((day, index) => (
              <div key={index} className="weather-day-card">
                <h3>{new Date(day.time).toLocaleDateString()}</h3>
                <p>
                  <FaTemperatureArrowUp
                    style={{ backgroundColor: "#c8e0fe" }}
                  />
                  {day.values.temperatureMax}°F
                </p>
                <p>
                  <FaTemperatureArrowDown
                    style={{ backgroundColor: "#c8e0fe" }}
                  />
                  {day.values.temperatureMin}°F
                </p>
                <p>
                  <BsWind style={{ backgroundColor: "#c8e0fe" }} />
                  {day.values.windSpeedAvg} mph avg
                </p>
                <p>
                  <BsClouds style={{ backgroundColor: "#c8e0fe" }} />
                  {day.values.cloudCoverAvg} % avg
                </p>
                <p>
                  <FiSunset style={{ backgroundColor: "#c8e0fe" }} />

                  {new Date(day.values.sunsetTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            ))
          ) : (
            <p>Loading weather data...</p>
          )}
        </div>
      </div>

      <div className="round-edit">
        <p>Rounds This Season: {roundLimit}</p>

        {isAdmin && (
          <div>
            {isEditing ? (
              <div>
                <input
                  type="number"
                  value={newRoundLimit}
                  onChange={handleInputChange}
                />
                <button onClick={handleSubmitClick}>Submit</button>
                <button onClick={handleCancelClick}>Cancel</button>
              </div>
            ) : (
              <button onClick={handleEditClick}>Edit Round Limit</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
