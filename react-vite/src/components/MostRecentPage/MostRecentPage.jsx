import { useState, useEffect } from "react";
import "./MostRecent.css";

const MostRecentPage = () => {
  const [rounds, setRounds] = useState([]);
  const [visibleRounds, setVisibleRounds] = useState(10); // Start by showing 10 rounds

  // Fetch the most recent rounds when the component loads
  useEffect(() => {
    fetch("/api/rounds/recent")
      .then((response) => response.json())
      .then((data) => {
        // Sort rounds by date (most recent first)
        const sortedRounds = data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setRounds(sortedRounds);
      })
      .catch((error) => console.error("Error fetching rounds:", error));
  }, []);

  // Function to load more rounds
  const loadMoreRounds = () => {
    setVisibleRounds((prevVisibleRounds) => prevVisibleRounds + 10);
  };

  return (
    <div className="most-recent-page">
      <h2>Most Recent Rounds</h2>
      {rounds.slice(0, visibleRounds).map((round) => (
        <div key={round.id} className="round-card">
          <h4>
            Round played on {new Date(round.created_at).toLocaleDateString()}
          </h4>
          <p>
            <strong>Scorer:</strong>{" "}
            {round.scorer ? round.scorer.name : "Unknown"}
          </p>
          <p>
            <strong>Attester:</strong>{" "}
            {round.attester ? round.attester.name : "Unknown"}
          </p>
          <p>
            <strong>Scorecard Image:</strong>
          </p>
          <img
            src={`/static/uploads/${round.scorecard_image.split("/").pop()}`}
            alt="Scorecard"
            style={{ maxWidth: "100px" }}
          />
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
              {round.scores
                .reduce((acc, score) => {
                  const player = acc.find(
                    (p) => p.player_id === score.player_id
                  );
                  if (player) {
                    player.scores[score.hole_number - 1] = score.strokes;
                  } else {
                    acc.push({
                      player_id: score.player_id,
                      player_name: score.player ? score.player.name : "Unknown",
                      scores: Array(9)
                        .fill(null)
                        .map((_, i) =>
                          i === score.hole_number - 1 ? score.strokes : null
                        ),
                    });
                  }
                  return acc;
                }, [])
                .map((playerScore) => (
                  <tr key={playerScore.player_id}>
                    <td>{playerScore.player_name}</td>
                    {playerScore.scores.map((strokes, i) => (
                      <td key={i}>{strokes !== null ? strokes : "-"}</td>
                    ))}
                    <td>
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
        </div>
      ))}
      {visibleRounds < rounds.length && (
        <button onClick={loadMoreRounds} className="show-more-button">
          Show More
        </button>
      )}
    </div>
  );
};

export default MostRecentPage;
