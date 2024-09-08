import { useState, useEffect } from "react";
import Select from "react-select";
import "./RoundForm.css";

// const customStyles = {
//   control: (provided) => ({
//     ...provided,
//     backgroundColor: "#fff", // Ensure the background is white
//     color: "#000", // Ensure text color is black
//   }),
//   singleValue: (provided) => ({
//     ...provided,
//     color: "#000", // Ensure selected value text is black
//   }),
//   option: (provided, state) => ({
//     ...provided,
//     backgroundColor: state.isSelected ? "#e29dd3" : "#fff", // Highlight selected option
//     color: state.isSelected ? "#000" : "#000", // Ensure options text is black
//     "&:hover": {
//       backgroundColor: "#f0e1ec", // Add a hover effect to options
//     },
//   }),
//   placeholder: (provided) => ({
//     ...provided,
//     color: "#999", // Placeholder color
//   }),
// };

const RoundFormPage = () => {
  const [scorerId, setScorerId] = useState(null);
  const [attesterId, setAttesterId] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [players, setPlayers] = useState([]); // All players for Scorer and Attester
  const [availablePlayersForScores, setAvailablePlayersForScores] = useState(
    []
  ); // Only players who haven't hit round limit
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [scores, setScores] = useState({});
  const [photo, setPhoto] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [maxRounds, setMaxRounds] = useState(8); // Default value; you will fetch the actual value
  const [playerMessage, setPlayerMessage] = useState(""); // Message to show if a player has hit max rounds

  // Fetch the round limit and players
  useEffect(() => {
    // Fetch the maximum rounds allowed for the season
    fetch("/api/settings/round-limit")
      .then((response) => response.json())
      .then((data) => {
        setMaxRounds(data.round_limit);

        // Fetch all players for Scorer and Attester (no round limit filter)
        return fetch("/api/players");
      })
      .then((response) => response.json())
      .then((data) => {
        // Set players for Scorer and Attester (all players)
        setPlayers(data);

        // Filter out players for "Select Player" who have hit the max rounds
        const availablePlayersForScores = data.filter(
          (player) => player.rounds_played < maxRounds
        );
        setAvailablePlayersForScores(availablePlayersForScores);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [maxRounds]);

  // Handle player selection
  const handlePlayerSelect = (player) => {
    if (
      selectedPlayers.length < 4 &&
      !selectedPlayers.some((p) => p.id === player.value)
    ) {
      const selectedPlayer = availablePlayersForScores.find(
        (p) => p.id === player.value
      );
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

  const playerOptions = availablePlayersForScores.map((player) => ({
    value: player.id,
    label: player.name,
  }));

  return (
    <div className="round-form-container">
      {/* <h2>Submit a Round</h2> */}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="label-form">
          <label>
            Scorer:{" "}
            {scorerId ? players.find((p) => p.id === scorerId.value)?.name : ""}
          </label>
          <Select
            // styles={customStyles}
            options={players.map((player) => ({
              value: player.id,
              label: player.name,
            }))}
            value={scorerId}
            onChange={setScorerId}
            placeholder="Select Scorer"
          />
        </div>
        <div className="select-backgrounds">
          <label>
            Attester:{" "}
            {attesterId
              ? players.find((p) => p.id === attesterId.value)?.name
              : ""}
          </label>
          <Select
            // styles={customStyles}
            options={players.map((player) => ({
              value: player.id,
              label: player.name,
            }))}
            value={attesterId}
            onChange={setAttesterId}
            placeholder="Select Attester"
          />
        </div>

        {selectedPlayer && playerMessage && (
          <div className="player-message">{playerMessage}</div>
        )}

        {selectedPlayers.map((player) => (
          <div className="select-backgrounds" key={player.id}>
            <h3 className="remove-h3">
              {player.name}{" "}
              {!isSubmitted && (
                <button
                  className="remove-button"
                  type="button"
                  onClick={() => handlePlayerRemove(player.id)}
                >
                  Remove
                </button>
              )}
            </h3>
            {[...Array(9)].map((_, i) => (
              <div key={i} className="score-input">
                <label className="holess">Hole {i + 1}:</label>
                <input
                  type="number"
                  value={scores[player.id]?.[i + 1] || ""}
                  onChange={(e) =>
                    handleScoreChange(player.id, i + 1, e.target.value)
                  }
                  disabled={isSubmitted}
                />
              </div>
            ))}
          </div>
        ))}

        {selectedPlayers.length < 4 && (
          <div className="select-player">
            <label>Select Player:</label>
            <Select
              options={playerOptions}
              value={selectedPlayer}
              onChange={handlePlayerSelect}
              placeholder="Select Player"
            />
          </div>
        )}

        <div className="photo-upload">
          <label>Upload Scorecard Photo:</label>
          <input
            type="file"
            onChange={handlePhotoChange}
            accept="image/*"
            capture
            disabled={isSubmitted}
          />
        </div>
        <div className="button-submit-bottom">
          <button type="submit" disabled={isSubmitted}>
            Submit Round
          </button>
        </div>
        {imageLoading && (
          <p className="image-loading">Loading image to AWS...</p>
        )}
      </form>
    </div>
  );
};

export default RoundFormPage;
