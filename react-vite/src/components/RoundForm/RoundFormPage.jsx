import { useState, useEffect } from "react";
import "./RoundForm.css";

const RoundFormPage = () => {
  const [scorerId, setScorerId] = useState("");
  const [attesterId, setAttesterId] = useState("");
  const [players, setPlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [scores, setScores] = useState({});

  useEffect(() => {
    // Fetch players from the API to populate the dropdowns
    fetch("/api/players")
      .then((response) => response.json())
      .then((data) => setPlayers(data))
      .catch((error) => console.error("Error fetching players:", error));
  }, []);

  const handlePlayerSelect = (e) => {
    const playerId = e.target.value;
    if (
      selectedPlayers.length < 4 &&
      !selectedPlayers.some((p) => p.id === playerId)
    ) {
      const selectedPlayer = players.find((p) => p.id === parseInt(playerId));
      setSelectedPlayers([...selectedPlayers, selectedPlayer]);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const roundData = {
      scorer_id: scorerId,
      attester_id: attesterId,
      scores: selectedPlayers.map((player) => ({
        player_id: player.id,
        score_data: scores[player.id],
      })),
    };

    try {
      const response = await fetch("/api/rounds", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(roundData),
      });

      if (response.ok) {
        alert("Round submitted successfully!");
      } else {
        const errorData = await response.json();
        console.error("Error submitting round:", errorData);
        alert("Failed to submit round");
      }
    } catch (error) {
      console.error("Error submitting round:", error);
      alert("Failed to submit round");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Scorer:</label>
        <select value={scorerId} onChange={(e) => setScorerId(e.target.value)}>
          <option value="">Select Scorer</option>
          {players.map((player) => (
            <option key={player.id} value={player.id}>
              {player.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Attester:</label>
        <select
          value={attesterId}
          onChange={(e) => setAttesterId(e.target.value)}
        >
          <option value="">Select Attester</option>
          {players.map((player) => (
            <option key={player.id} value={player.id}>
              {player.name}
            </option>
          ))}
        </select>
      </div>

      {selectedPlayers.map((player) => (
        <div key={player.id}>
          <h3>{player.name}</h3>
          {[...Array(9)].map((_, i) => (
            <div key={i}>
              <label>Hole {i + 1}:</label>
              <input
                type="number"
                value={scores[player.id]?.[i + 1] || ""}
                onChange={(e) =>
                  handleScoreChange(player.id, i + 1, e.target.value)
                }
              />
            </div>
          ))}
        </div>
      ))}

      {selectedPlayers.length < 4 && (
        <div>
          <label>Select Player:</label>
          <select onChange={handlePlayerSelect}>
            <option value="">Select Player</option>
            {players.map((player) => (
              <option key={player.id} value={player.id}>
                {player.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <button type="submit">Submit Round</button>
    </form>
  );
};

export default RoundFormPage;
