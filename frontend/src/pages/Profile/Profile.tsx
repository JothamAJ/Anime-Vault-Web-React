import React, { useEffect, useContext } from "react";
import { UserContext } from "../../contexts/AuthContext";

function ProfilePage() {
  const { user, setUser } = useContext(UserContext);

  // Fetch and update user context on component mount
  useEffect(() => {
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

  // Show message if user is not logged in
  if (!user) return <div>Please log in to view your profile.</div>;

  // Show profile if user is logged in
  return (
    <div>
      <h1>{user.username}'s Profile</h1>

      <p>Email: {user.email}</p>
    </div>
  );
}

export default ProfilePage;
