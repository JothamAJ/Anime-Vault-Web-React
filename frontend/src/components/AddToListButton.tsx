import React, { useState } from "react";
import { Anime } from "../types/Anime";

type AddToListButtonProps = {
  anime: Anime & { episodes: number; genres: string }; // extend optional fields to be required here
  category?: string;
};

export default function AddToListButton({
  anime,
  category = "Watching",
}: AddToListButtonProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAdd = async () => {
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch("http://127.0.0.1:5000/add_to_list", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          anime_id: anime.id,
          anime_title: anime.title,
          // anime_main_picture: anime.main_picture,
          anime_synopsis: anime.synopsis,
          anime_episodes: anime.episodes,
          anime_genres: anime.genres,
          status: category,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "Added to list!");
        console.log("Added to list:", data);
      } else {
        setError(data.error || "Failed to add anime");
        console.error("Error adding to list:", data);
      }
    } catch (err) {
      setError("Network error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button onClick={handleAdd} disabled={loading}>
        {loading ? "Adding..." : `Add to ${category}`}
      </button>

      {message && <div style={{ color: "green" }}>{message}</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
    </>
  );
}
