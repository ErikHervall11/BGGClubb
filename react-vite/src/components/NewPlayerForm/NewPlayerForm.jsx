import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./NewPlayerForm.css";

const NewPlayerForm = () => {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/players", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      if (response.ok) {
        alert("Player added successfully!");
        navigate("/players");
      } else {
        const errorData = await response.json();
        console.error("Error adding player:", errorData);
        alert("Failed to add player");
      }
    } catch (error) {
      console.error("Error submitting player:", error);
      alert("Failed to add player");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="new-player-form">
      <h2>Add New Golfer</h2>
      <form onSubmit={handleSubmit}>
        <div className="add-player-div">
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Add Player"}
        </button>
      </form>
    </div>
  );
};

export default NewPlayerForm;
