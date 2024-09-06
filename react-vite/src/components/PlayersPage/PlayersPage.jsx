import { useState, useEffect } from "react";
import Select from "react-select";
import "./PlayersPage.css";

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    width: "30%",
    backgroundColor: state.isFocused ? "#e29dd3" : "#e29dd3", // Change background color
    borderColor: state.isFocused ? "#e29dd3" : "black", // Change border color when focused and unfocused
    borderWidth: "2px",
    boxShadow: state.isFocused ? "0 0 5px 5px #c8e0fe" : null, // Add a box shadow when focused
    "&:hover": {
      borderColor: "#c8e0fe", // Change border color on hover
    },
  }),
  menu: (provided) => ({
    ...provided,
    width: "30%",
    backgroundColor: "#fff", // Change the background color of the dropdown menu
    borderColor: "#c8e0fe",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#c60c71"
      : state.isFocused
      ? "#f5f5f5"
      : "#fff", // Change background color for selected and focused options
    color: state.isSelected ? "#fff" : "#333", // Change text color for selected and non-selected
    "&:hover": {
      backgroundColor: "#c8e0fe", // Background color when hovering over options
    },
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#999", // Change placeholder text color
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#333", // Change the text color of the selected value
  }),
};

const PlayersPage = () => {
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [bestScores, setBestScores] = useState(Array(9).fill(null)); // Array to hold best scores for 9 holes
  const [rounds, setRounds] = useState([]);
  const [roundLimit, setRoundLimit] = useState(8); // Default value; you will fetch the actual value

  // Fetch players data when component loads
  useEffect(() => {
    fetch("/api/players")
      .then((response) => response.json())
      .then((data) => {
        const playerOptions = data.map((player) => ({
          value: player.id,
          label: player.name,
          rounds_played: player.rounds_played, // Add rounds_played to player data
        }));
        setPlayers(playerOptions);
      })
      .catch((error) => console.error("Error fetching players:", error));

    // Fetch the maximum rounds allowed for the season
    fetch("/api/settings/round-limit")
      .then((response) => response.json())
      .then((data) => setRoundLimit(data.season_round_limit))
      .catch((error) => console.error("Error fetching round limit:", error));
  }, []);

  // Fetch and calculate the best scores when a player is selected
  useEffect(() => {
    if (selectedPlayer) {
      fetch(`/api/scores/player/${selectedPlayer.value}`)
        .then((response) => response.json())
        .then((data) => {
          // Initialize best scores array with 9 null values
          const bestScoresArray = Array(9).fill(null);

          data.forEach((score) => {
            const holeIndex = score.hole_number - 1; // Hole number to index (0-based)
            if (
              bestScoresArray[holeIndex] === null ||
              score.strokes < bestScoresArray[holeIndex].strokes
            ) {
              bestScoresArray[holeIndex] = score;
            }
          });

          setBestScores(bestScoresArray);
        })
        .catch((error) =>
          console.error("Error fetching player scores:", error)
        );

      // Fetch the rounds for the selected player
      fetch(`/api/rounds/player/${selectedPlayer.value}`)
        .then((response) => response.json())
        .then((data) => {
          // Sort rounds by date (most recent first)
          const sortedRounds = data.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );
          setRounds(sortedRounds);
        })
        .catch((error) =>
          console.error("Error fetching player rounds:", error)
        );
    }
  }, [selectedPlayer]);

  return (
    <div className="players-page">
      <h2>Select a Player</h2>
      <Select
        className="player-select-dropdown"
        options={players}
        value={selectedPlayer}
        onChange={setSelectedPlayer}
        placeholder="Search for a player..."
        styles={customStyles} // Apply custom styles here
      />

      {selectedPlayer && (
        <div>
          {selectedPlayer.rounds_played >= roundLimit && (
            <p>{`${selectedPlayer.label} has hit the maximum rounds for this season.`}</p>
          )}
          <div className="players-best-scores">
            <h3>{selectedPlayer.label}&apos;s Best Holes</h3>
            <table className="players-best-holes-table">
              <thead>
                <tr>
                  <th></th>
                  {bestScores.map((_, index) => (
                    <th key={index}>Hole {index + 1}</th>
                  ))}
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Score</td>
                  {bestScores.map((score, index) => (
                    <td key={index}>{score ? score.strokes : "-"}</td>
                  ))}
                  <td>
                    {bestScores.reduce(
                      (acc, score) => acc + (score ? score.strokes : 0),
                      0
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="players-round-history">
            <h3>Round History</h3>
            {rounds.map((round) => (
              <div key={round.id} className="players-round-card">
                <div className="players-scorecard-layout">
                  {/* Left column: table for hole details */}
                  <div className="players-score-details">
                    <table className="players-hole-info-table">
                      <thead>
                        <tr>
                          <th>Player</th>
                          {Array.from({ length: 9 }, (_, i) => (
                            <th key={i}>Hole {i + 1}</th>
                          ))}
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {round.scores
                          .reduce((acc, score) => {
                            const player = acc.find(
                              (p) => p.player_id === score.player_id
                            );
                            if (player) {
                              player.scores[score.hole_number - 1] =
                                score.strokes;
                            } else {
                              acc.push({
                                player_id: score.player_id,
                                player_name: score.player
                                  ? score.player.name
                                  : "Unknown",
                                scores: Array(9)
                                  .fill(null)
                                  .map((_, i) =>
                                    i === score.hole_number - 1
                                      ? score.strokes
                                      : null
                                  ),
                              });
                            }
                            return acc;
                          }, [])
                          .map((playerScore) => (
                            <tr key={playerScore.player_id}>
                              <td className="players-player-column">
                                {playerScore.player_name}
                              </td>
                              {playerScore.scores.map((strokes, i) => (
                                <td key={i}>
                                  {strokes !== null ? strokes : "-"}
                                </td>
                              ))}
                              <td className="players-out-column">
                                {playerScore.scores.reduce(
                                  (acc, strokes) =>
                                    acc + (strokes !== null ? strokes : 0),
                                  0
                                )}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>

                    <div className="players-scorecard-footer">
                      <p>
                        <span>Scorer:</span>{" "}
                        <span className="signature">
                          {round.scorer ? round.scorer.name : "Unknown"}
                        </span>
                      </p>
                      <p>
                        <span>Attester:</span>{" "}
                        <span className="signature">
                          {round.attester ? round.attester.name : "Unknown"}
                        </span>
                      </p>
                      <p>
                        <span>Date:</span>{" "}
                        <span className="signature">
                          {new Date(round.created_at).toLocaleDateString()}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Right column: scorecard image */}
                  <div className="players-scorecard-image-column">
                    <img
                      src={`${round.scorecard_image}`}
                      alt="Scorecard"
                      className="players-scorecard-image"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayersPage;

// import { useState, useEffect } from "react";
// import Select from "react-select";
// import "./PlayersPage.css";

// const PlayersPage = () => {
//   const [players, setPlayers] = useState([]);
//   const [selectedPlayer, setSelectedPlayer] = useState(null);
//   const [bestScores, setBestScores] = useState(Array(9).fill(null)); // Array to hold best scores for 9 holes
//   const [rounds, setRounds] = useState([]);

//   // Fetch players data when component loads
//   useEffect(() => {
//     fetch("/api/players")
//       .then((response) => response.json())
//       .then((data) => {
//         const playerOptions = data.map((player) => ({
//           value: player.id,
//           label: player.name,
//         }));
//         setPlayers(playerOptions);
//       })
//       .catch((error) => console.error("Error fetching players:", error));
//   }, []);

//   // Fetch and calculate the best scores when a player is selected
//   useEffect(() => {
//     if (selectedPlayer) {
//       fetch(`/api/scores/player/${selectedPlayer.value}`)
//         .then((response) => response.json())
//         .then((data) => {
//           // Initialize best scores array with 9 null values
//           const bestScoresArray = Array(9).fill(null);

//           data.forEach((score) => {
//             const holeIndex = score.hole_number - 1; // Hole number to index (0-based)
//             if (
//               bestScoresArray[holeIndex] === null ||
//               score.strokes < bestScoresArray[holeIndex].strokes
//             ) {
//               bestScoresArray[holeIndex] = score;
//             }
//           });

//           setBestScores(bestScoresArray);
//         })
//         .catch((error) =>
//           console.error("Error fetching player scores:", error)
//         );

//       // Fetch the rounds for the selected player
//       fetch(`/api/rounds/player/${selectedPlayer.value}`)
//         .then((response) => response.json())
//         .then((data) => {
//           // Sort rounds by date (most recent first)
//           const sortedRounds = data.sort(
//             (a, b) => new Date(b.created_at) - new Date(a.created_at)
//           );
//           setRounds(sortedRounds);
//         })
//         .catch((error) =>
//           console.error("Error fetching player rounds:", error)
//         );
//     }
//   }, [selectedPlayer]);

//   return (
//     <div>
//       <h2>Select a Player</h2>
//       <Select
//         options={players}
//         value={selectedPlayer}
//         onChange={setSelectedPlayer}
//         placeholder="Search for a player..."
//       />

//       {selectedPlayer && (
//         <div>
//           <div className="best-scores">
//             <h3>{selectedPlayer.label}&apos;s Best Holes</h3>
//             <table>
//               <thead>
//                 <tr>
//                   <th>Hole</th>
//                   <th>Score</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {bestScores.map((score, index) => (
//                   <tr key={index}>
//                     <td>Hole {index + 1}</td>
//                     <td>{score ? score.strokes : "-"}</td>
//                   </tr>
//                 ))}
//                 <tr>
//                   <td>Total</td>
//                   <td>
//                     {bestScores.reduce(
//                       (acc, score) => acc + (score ? score.strokes : 0),
//                       0
//                     )}
//                   </td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>

//           <div className="round-history">
//             <h3>Round History</h3>
//             {rounds.map((round) => (
//               <div key={round.id} className="round-card">
//                 <h4>
//                   Round played on{" "}
//                   {new Date(round.created_at).toLocaleDateString()}
//                 </h4>
//                 <p>
//                   <strong>Scorer:</strong>{" "}
//                   {round.scorer ? round.scorer.name : "Unknown"}
//                 </p>
//                 <p>
//                   <strong>Attester:</strong>{" "}
//                   {round.attester ? round.attester.name : "Unknown"}
//                 </p>
//                 <p>
//                   <strong>Scorecard Image:</strong>
//                 </p>
//                 <img
//                   src={`/static/${round.scorecard_image}`}
//                   alt="Scorecard"
//                   style={{ maxWidth: "100px" }}
//                 />

//                 <table>
//                   <thead>
//                     <tr>
//                       <th>Player</th>
//                       {Array.from({ length: 9 }, (_, i) => (
//                         <th key={i}>Hole {i + 1}</th>
//                       ))}
//                       <th>Total</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {round.scores
//                       .reduce((acc, score) => {
//                         const player = acc.find(
//                           (p) => p.player_id === score.player_id
//                         );
//                         if (player) {
//                           player.scores[score.hole_number - 1] = score.strokes;
//                         } else {
//                           acc.push({
//                             player_id: score.player_id,
//                             player_name: score.player
//                               ? score.player.name
//                               : "Unknown",
//                             scores: Array(9)
//                               .fill(null)
//                               .map((_, i) =>
//                                 i === score.hole_number - 1
//                                   ? score.strokes
//                                   : null
//                               ),
//                           });
//                         }
//                         return acc;
//                       }, [])
//                       .map((playerScore) => (
//                         <tr key={playerScore.player_id}>
//                           <td>{playerScore.player_name}</td>
//                           {playerScore.scores.map((strokes, i) => (
//                             <td key={i}>{strokes !== null ? strokes : "-"}</td>
//                           ))}
//                           <td>
//                             {playerScore.scores.reduce(
//                               (acc, strokes) =>
//                                 acc + (strokes !== null ? strokes : 0),
//                               0
//                             )}
//                           </td>
//                         </tr>
//                       ))}
//                   </tbody>
//                 </table>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PlayersPage;
