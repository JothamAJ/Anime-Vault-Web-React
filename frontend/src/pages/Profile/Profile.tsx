import React, { useEffect, useContext, useState } from "react";
import { UserContext } from "../../contexts/AuthContext";

function ProfilePage() {
  const { user, setUser } = useContext(UserContext);
  const [watchlistCategory, setWatchlistCategory] = useState("Watching");

  useEffect(() => {
    // Fetch the user profile from the backend
    fetch("http://127.0.0.1:5000/api/profile", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch profile");
        return res.json();
      })
      .then((data) => {
        if (data.loggedIn) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      })
      .catch((err) => console.error("Error fetching profile:", err));
  }, [setUser]);

  if (!user) return <div>Please log in to view your profile.</div>;

  return (
    <div style={{ maxWidth: 400, margin: "auto", textAlign: "center" }}>
      {/* Default luffy avatar for user profile */}
      <img
        src="/default.jpg"
        alt="Default user avatar"
        style={{ borderRadius: "50%", width: 200, height: 200 }}
      />

      <h2>Welcome, {user.username}!!</h2>
      <p>{user.email}</p>

      {/* Watchlist buttons */}
      <div style={{ marginTop: 20 }}>
        {["Watching", "Completed", "Plan to Watch"].map((category) => (
          <button
            // use category as key for each button with onclick handler to set watchlist category
            key={category}
            onClick={() => setWatchlistCategory(category)}
            style={{
              marginRight: 10,
              padding: "5px 10px",
              backgroundColor:
                watchlistCategory === category ? "#007bff" : "#eee",
              color: watchlistCategory === category ? "white" : "black",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Placeholder for watchlist content */}
      <div style={{ marginTop: 20 }}>
        <p>
          Showing: <strong>{watchlistCategory}</strong> items
        </p>
        {/* You can later fetch and show the actual list here */}
      </div>
    </div>
  );
}

export default ProfilePage;
