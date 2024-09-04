// HomePage.jsx
import { useState, useEffect } from "react";

function HomePage({ isAdmin }) {
  const [roundLimit, setRoundLimit] = useState(8);
  const [isEditing, setIsEditing] = useState(false);
  const [newRoundLimit, setNewRoundLimit] = useState(roundLimit);

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
      <h1>Welcome to the Golf Club</h1>
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
  );
}

export default HomePage;
