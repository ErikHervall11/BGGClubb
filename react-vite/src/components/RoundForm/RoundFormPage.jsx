import { useState, useEffect } from "react";
import "./RoundForm.css";
import Select from "react-select";

const RoundFormPage = () => {
  const [scorerId, setScorerId] = useState(null);
  const [attesterId, setAttesterId] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [players, setPlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [scores, setScores] = useState({});
  const [photo, setPhoto] = useState(null); // New state for handling the photo file
  const [isSubmitted, setIsSubmitted] = useState(false); // Track form submission
  const [imageLoading, setImageLoading] = useState(false); // Track image loading state
  const [maxRounds, setMaxRounds] = useState(8); // Default value; you will fetch the actual value
  const [playerMessage, setPlayerMessage] = useState(""); // Message to show if a player has hit max rounds

  useEffect(() => {
    // Fetch the maximum rounds allowed for the season
    fetch("/api/settings/round-limit")
      .then((response) => response.json())
      .then((data) => {
        setMaxRounds(data.round_limit);

        // Fetch the players and their round counts after setting the round limit
        return fetch("/api/players");
      })
      .then((response) => response.json())
      .then((data) => {
        // Filter out players who have hit the max rounds
        const availablePlayers = data.filter(
          (player) => player.rounds_played < maxRounds
        );
        setPlayers(availablePlayers);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [maxRounds]);

  const handlePlayerSelect = (player) => {
    if (
      selectedPlayers.length < 4 &&
      !selectedPlayers.some((p) => p.id === player.value)
    ) {
      const selectedPlayer = players.find((p) => p.id === player.value);
      setSelectedPlayers([...selectedPlayers, selectedPlayer]);
      setSelectedPlayer(null); // Reset selected player after adding

      // Check if the player has hit the max rounds
      if (selectedPlayer.rounds_played >= maxRounds) {
        setPlayerMessage(
          `${selectedPlayer.name} has hit the maximum rounds for this season`
        );
      } else {
        setPlayerMessage(""); // Clear the message if they haven't hit the max
      }
    }
  };

  const handlePlayerRemove = (playerId) => {
    if (!isSubmitted) {
      setSelectedPlayers(
        selectedPlayers.filter((player) => player.id !== playerId)
      );
      setScores((prevScores) => {
        const updatedScores = { ...prevScores };
        delete updatedScores[playerId];
        return updatedScores;
      });
    }
  };

  const handleScoreChange = (playerId, holeNumber, strokes) => {
    setScores((prevScores) => ({
      ...prevScores,
      [playerId]: {
        ...prevScores[playerId],
        [holeNumber]: strokes,
      },
    }));
  };

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]); // Store the selected photo in state
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("scorer_id", scorerId?.value);
    formData.append("attester_id", attesterId?.value);
    formData.append("photo", photo);

    selectedPlayers.forEach((player) => {
      const scoreData = scores[player.id];
      if (scoreData) {
        Object.keys(scoreData).forEach((holeNumber) => {
          formData.append(
            `scores[${player.id}][${holeNumber}]`,
            scoreData[holeNumber]
          );
        });
      }
    });

    setImageLoading(true); // Start loading spinner

    try {
      const response = await fetch("/api/rounds", {
        method: "POST",
        // credentials: "include", // Ensure cookies are sent with the request
        body: formData, // Use FormData for the request body
      });

      if (response.ok) {
        alert("Round submitted successfully!");
        setIsSubmitted(true); // Set form as submitted
      } else {
        const errorData = await response.json();
        console.error("Error submitting round:", errorData);
        alert("Failed to submit round");
      }
    } catch (error) {
      console.error("Error submitting round:", error);
      alert("Failed to submit round");
    } finally {
      setImageLoading(false); // Stop loading spinner
    }
  };

  const playerOptions = players.map((player) => ({
    value: player.id,
    label: player.name,
  }));

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <div>
        <label>Scorer:</label>
        <Select
          options={playerOptions}
          value={scorerId}
          onChange={setScorerId}
          placeholder="Select Scorer"
        />
      </div>
      <div>
        <label>Attester:</label>
        <Select
          options={playerOptions}
          value={attesterId}
          onChange={setAttesterId}
          placeholder="Select Attester"
        />
      </div>

      {selectedPlayer && playerMessage && (
        <div className="player-message">{playerMessage}</div>
      )}

      {selectedPlayers.map((player) => (
        <div key={player.id}>
          <h3>
            {player.name}{" "}
            {!isSubmitted && (
              <button
                type="button"
                onClick={() => handlePlayerRemove(player.id)}
              >
                Remove
              </button>
            )}
          </h3>
          {[...Array(9)].map((_, i) => (
            <div key={i}>
              <label>Hole {i + 1}:</label>
              <input
                type="number"
                value={scores[player.id]?.[i + 1] || ""}
                onChange={(e) =>
                  handleScoreChange(player.id, i + 1, e.target.value)
                }
                disabled={isSubmitted} // Disable input after submission
              />
            </div>
          ))}
        </div>
      ))}

      {selectedPlayers.length < 4 && (
        <div>
          <label>Select Player:</label>
          <Select
            options={playerOptions}
            value={selectedPlayer}
            onChange={handlePlayerSelect}
            placeholder="Select Player"
          />
        </div>
      )}

      <div>
        <label>Upload Scorecard Photo:</label>
        <input
          type="file"
          onChange={handlePhotoChange}
          accept="image/*"
          capture="environment"
          disabled={isSubmitted} // Disable input after submission
        />
      </div>

      <button type="submit" disabled={isSubmitted}>
        Submit Round
      </button>

      {imageLoading && <p>Loading image to AWS...</p>}
    </form>
  );
};

export default RoundFormPage;
