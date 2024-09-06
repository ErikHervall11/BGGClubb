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

  const apiKey = "XFFERAZ9K18NdW8dS60EHEfWqh8eTARR"; // Tomorrow.io API key
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

  // Fetch Weather Data from Tomorrow.io API
  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        // Only grab the "daily" timeline data
        const dailyWeather = data.timelines.daily;

        setWeatherData(dailyWeather);
      })
      .catch((error) => console.error("Error fetching weather data:", error));
  }, []);

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

// import { useState, useEffect } from "react";
// import "./HomePage.css";

// function HomePage({ isAdmin }) {
//   const [roundLimit, setRoundLimit] = useState(8);
//   const [isEditing, setIsEditing] = useState(false);
//   const [newRoundLimit, setNewRoundLimit] = useState(roundLimit);
//   const [weatherData, setWeatherData] = useState([]);

//   console.log(weatherData);

//   const apiKey = "a880c3e3516c88e662154a3bd089e1b9";
//   const lat = 38.01983211871731;
//   const lon = -122.52246954832552;
//   const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

//   useEffect(() => {
//     fetch("/api/settings/round-limit")
//       .then((response) => response.json())
//       .then((data) => {
//         if (data.round_limit) {
//           setRoundLimit(data.round_limit);
//         }
//       })
//       .catch((error) => console.error("Error fetching round limit:", error));
//   }, []);

//   // Fetch Weather Data
//   useEffect(() => {
//     fetch(url)
//       .then((response) => response.json())
//       .then((data) => {
//         console.log("API Response:", data); // This will print the full API response
//         // Group weather data by date and filter specific times (6 AM, 9 AM, 12 PM, 3 PM, 6 PM)
//         const filteredTimes = [
//           "06:00:00",
//           "09:00:00",
//           "12:00:00",
//           "15:00:00",
//           "18:00:00",
//         ];
//         const groupedData = data.list.reduce((acc, forecast) => {
//           const [date, time] = forecast.dt_txt.split(" "); // Split dt_txt into date and time

//           if (filteredTimes.includes(time)) {
//             // Check if the time is one of the desired ones
//             if (!acc[date]) {
//               acc[date] = [];
//             }
//             acc[date].push(forecast);
//           }
//           // console.log(forecast);
//           return acc;
//         }, {});

//         // Get the first 5 days from groupedData
//         const firstFiveDays = Object.keys(groupedData)
//           .slice(0, 5)
//           .map((date) => ({ date, forecasts: groupedData[date] }));

//         setWeatherData(firstFiveDays);
//       })
//       .catch((error) => console.error("Error fetching weather data:", error));
//   }, []);

//   const handleEditClick = () => {
//     setIsEditing(true);
//   };

//   const handleInputChange = (e) => {
//     setNewRoundLimit(e.target.value);
//   };

//   const handleCancelClick = () => {
//     setIsEditing(false);
//     setNewRoundLimit(roundLimit);
//   };

//   const handleSubmitClick = () => {
//     const confirmSubmit = window.confirm(
//       "Are you sure you want to update the round limit?"
//     );
//     if (confirmSubmit) {
//       fetch("/api/settings/round-limit", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ round_limit: newRoundLimit }),
//       })
//         .then((response) => response.json())
//         .then((data) => {
//           setRoundLimit(data.round_limit);
//           setIsEditing(false);
//         })
//         .catch((error) => console.error("Error updating round limit:", error));
//     }
//   };

//   return (
//     <div className="home-page">
//       <div className="header-top">
//         <h1 className="header">BAD GIRLS GOLF CLUB</h1>
//       </div>

//       {/* Weather Forecast Section */}
//       <div className="weather-section">
//         <h2>5-Day Weather Forecast</h2>
//         <div className="weather-container">
//           {weatherData.length > 0 ? (
//             weatherData.map((day, index) => (
//               <div key={index} className="weather-day-card">
//                 <h3>{new Date(day.date).toLocaleDateString()}</h3>
//                 {day.forecasts.map((forecast, i) => (
//                   <div key={i} className="weather-interval">
//                     <p>
//                       <strong>Time:</strong>{" "}
//                       {new Date(forecast.dt_txt).toLocaleTimeString([], {
//                         hour: "2-digit",
//                         minute: "2-digit",
//                       })}
//                     </p>
//                     <p>
//                       <strong>Temp:</strong> {forecast.main.temp}°F
//                     </p>
//                     <p>{forecast.weather[0].description.toUpperCase()}</p>
//                     <p>
//                       <strong>Wind:</strong> {forecast.wind.speed} mph
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             ))
//           ) : (
//             <p>Loading weather data...</p>
//           )}
//         </div>
//       </div>

//       <p>Rounds This Season: {roundLimit}</p>

//       {isAdmin && (
//         <div>
//           {isEditing ? (
//             <div>
//               <input
//                 type="number"
//                 value={newRoundLimit}
//                 onChange={handleInputChange}
//               />
//               <button onClick={handleSubmitClick}>Submit</button>
//               <button onClick={handleCancelClick}>Cancel</button>
//             </div>
//           ) : (
//             <button onClick={handleEditClick}>Edit Round Limit</button>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// export default HomePage;
