import { useState, useEffect } from "react";

function HomePage() {
  // Set a default value of 8 for roundLimit in case the API doesn't return a value
  const [roundLimit, setRoundLimit] = useState(8);

  useEffect(() => {
    fetch("/api/settings/round-limit")
      .then((response) => response.json())
      .then((data) => {
        // If the data from the API is valid, update the state, otherwise keep the default value
        if (data.round_limit) {
          setRoundLimit(data.round_limit);
        }
      })
      .catch((error) => console.error("Error fetching round limit:", error));
  }, []);

  return (
    <div className="home-page">
      <h1>Welcome to the Golf Club</h1>
      <p>Rounds This Season: {roundLimit}</p>
    </div>
  );
}

export default HomePage;
