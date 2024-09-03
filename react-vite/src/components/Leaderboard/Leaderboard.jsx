import { useState, useEffect } from "react";
import "./Leaderboard.css";

function Leaderboard() {
  const [topPlayers, setTopPlayers] = useState([]);
  const [visiblePlayers, setVisiblePlayers] = useState(10); // Start by showing 10 players

  useEffect(() => {
    fetch("/api/players")
      .then((response) => response.json())
      .then((players) => {
        const playerScores = [];

        // Fetch best scores for each player and calculate total
        Promise.all(
          players.map((player) =>
            fetch(`/api/scores/player/${player.id}`)
              .then((response) => response.json())
              .then((data) => {
                const bestHoles = Array(9).fill(null);

                data.forEach((score) => {
                  const holeIndex = score.hole_number - 1;
                  if (
                    bestHoles[holeIndex] === null ||
                    score.strokes < bestHoles[holeIndex].strokes
                  ) {
                    bestHoles[holeIndex] = score;
                  }
                });

                const totalBestScore = bestHoles.reduce(
                  (acc, score) => acc + (score ? score.strokes : 0),
                  0
                );

                playerScores.push({
                  name: player.name,
                  bestHoles,
                  totalBestScore,
                });
              })
          )
        ).then(() => {
          // Sort players by total best score (lowest first)
          const sortedPlayers = playerScores.sort((a, b) => {
            if (a.totalBestScore === 0 && b.totalBestScore !== 0) return 1;
            if (a.totalBestScore !== 0 && b.totalBestScore === 0) return -1;
            return a.totalBestScore - b.totalBestScore;
          });

          setTopPlayers(sortedPlayers);
        });
      })
      .catch((error) => console.error("Error fetching players:", error));
  }, []);

  // Function to load more players
  const loadMorePlayers = () => {
    setVisiblePlayers((prevVisiblePlayers) => prevVisiblePlayers + 10);
  };

  return (
    <div className="leaderboard">
      <h2>Leaderboard</h2>
      {topPlayers.length === 0 ? (
        <p>No players yet</p>
      ) : (
        <div>
          <table>
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
              {topPlayers.slice(0, visiblePlayers).map((player, index) => (
                <tr key={index}>
                  <td>{player.name}</td>
                  {player.bestHoles.map((score, i) => (
                    <td key={i}>{score ? score.strokes : "-"}</td>
                  ))}
                  <td>{player.totalBestScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {visiblePlayers < topPlayers.length && (
            <button onClick={loadMorePlayers} className="show-more-button">
              Show More
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default Leaderboard;
