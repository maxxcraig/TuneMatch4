import React from 'react';
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const Profile = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const username = queryParams.get("username");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem("spotify_token", token);
      setLoading(false);
    } else {
      setError("No access token found. Please log in again.");
    }
  }, [token]);

  if (loading) {
    return <h2 style={{ textAlign: "center", marginTop: "20px" }}>Loading...</h2>;
  }

  if (error) {
    return <h2 style={{ textAlign: "center", color: "red" }}>Error: {error}</h2>;
  }

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome, {username}!</h1>
      <p>Your Spotify account is now linked.</p>
      <p><strong>Access Token:</strong> {token ? "Stored Successfully" : "Not Found ok"}</p>
    </div>
  );
};

export default Profile;