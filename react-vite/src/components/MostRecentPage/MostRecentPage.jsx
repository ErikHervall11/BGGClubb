import { useState, useEffect } from "react";
import "./MostRecent.css";

const MostRecentPage = ({ isAdmin }) => {
  const [rounds, setRounds] = useState([]);
  const [visibleRounds, setVisibleRounds] = useState(10); // Start by showing 10 rounds

  // Fetch the most recent rounds
  useEffect(() => {
    fetch("/api/rounds/recent")
      .then((response) => response.json())
      .then((data) => {
        // Sort rounds by date
        const sortedRounds = data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setRounds(sortedRounds);
      })
      .catch((error) => console.error("Error fetching rounds:", error));
  }, []);

  // load more rounds
  const loadMoreRounds = () => {
    setVisibleRounds((prevVisibleRounds) => prevVisibleRounds + 10);
  };

  // Handle delete round
  const handleDeleteRound = (roundId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this round?"
    );
    if (confirmed) {
      fetch(`/api/rounds/admin/delete_round/${roundId}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            setRounds((prevRounds) =>
              prevRounds.filter((round) => round.id !== roundId)
            );
          } else {
            console.error("Failed to delete round.");
          }
        })
        .catch((error) => console.error("Error deleting round:", error));
    }
  };

  return (
    <div className="most-recent-page">
      <h2>Most Recent Rounds</h2>
      {rounds.slice(0, visibleRounds).map((round) => (
        <div key={round.id} className="round-card">
          {isAdmin && (
            <button
              className="delete-button"
              onClick={() => handleDeleteRound(round.id)}
            >
              Delete Round
            </button>
          )}
          <div className="scorecard-layout">
            {/* Left column: table for hole details */}
            <div className="score-details">
              <table className="hole-info-table">
                <thead>
                  <tr>
                    <th>HOLE</th>
                    {Array.from({ length: 9 }, (_, i) => (
                      <th key={i}>{i + 1}</th>
                    ))}
                    <th>OUT</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>PAR</td>
                    <td>4</td>
                    <td>3</td>
                    <td>3</td>
                    <td>4</td>
                    <td>3</td>
                    <td>3</td>
                    <td>4</td>
                    <td>3</td>
                    <td>4</td>
                    <td>31</td>
                  </tr>
                  <tr>
                    <td>Blue</td>
                    <td>343</td>
                    <td>105</td>
                    <td>204</td>
                    <td>279</td>
                    <td>92</td>
                    <td>270</td>
                    <td>180</td>
                    <td>100</td>
                    <td>270</td>
                    <td>1843</td>
                  </tr>
                  <tr>
                    <td>White</td>
                    <td>337</td>
                    <td>100</td>
                    <td>164</td>
                    <td>274</td>
                    <td>84</td>
                    <td>249</td>
                    <td>154</td>
                    <td>90</td>
                    <td>263</td>
                    <td>1715</td>
                  </tr>
                  <tr>
                    <td>Red</td>
                    <td>315</td>
                    <td>82</td>
                    <td>129</td>
                    <td>253</td>
                    <td>57</td>
                    <td>240</td>
                    <td>134</td>
                    <td>71</td>
                    <td>245</td>
                    <td>1526</td>
                  </tr>
                  <tr>
                    <td>Handicap</td>
                    <td>4</td>
                    <td>8</td>
                    <td>6</td>
                    <td>1</td>
                    <td>9</td>
                    <td>2</td>
                    <td>3</td>
                    <td>7</td>
                    <td>5</td>
                    <td></td>
                  </tr>
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
                          player_name: score.player
                            ? score.player.name
                            : "Unknown",
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
                        <td className="player-column">
                          {playerScore.player_name}
                        </td>
                        {playerScore.scores.map((strokes, i) => (
                          <td key={i} className="hole-column">
                            {strokes !== null ? strokes : "-"}
                          </td>
                        ))}
                        <td className="out-column">
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

              <div className="scorecard-footer">
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
            <div className="scorecard-image-column">
              <img
                src={`${round.scorecard_image}`}
                alt="Scorecard"
                className="scorecard-image"
              />
            </div>
          </div>
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
