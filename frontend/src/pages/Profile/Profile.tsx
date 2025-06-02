import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../contexts/AuthContext";

function ProfilePage() {
  const { user, setUser } = useContext(UserContext);
  const [profileData, setProfileData] = useState<any>(null);

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
          setProfileData(data.user);
          setUser(data.user); // directly set the user context with user object
        } else {
          setProfileData(null);
          setUser(null);
        }
      })
      .catch((err) => console.error("Error fetching profile:", err));
  }, []);

  if (!profileData) return <div>Loading profile...</div>;

  return (
    <div>
      <h1>{profileData.username}'s Profile</h1>
      <img src={profileData.image} alt="Profile" />
      <p>Email: {profileData.email}</p>
      {/* Add more profile details as needed */}
    </div>
  );
}

export default ProfilePage;
