import {
  Avatar,
  Box,
  Container,
  Paper,
  TextField,
  Typography,
  Button,
} from "@mui/material";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SignInPage = () => {
  //username and password states
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    //connect to flask backend using fetch and send state values
    try {
      const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        mode: "cors",
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log("Login successful!");
        navigate("/Home");
      } else {
        let errorMessage = "Unknown error";

        try {
          const errorData = await response.json();
          errorMessage = errorData?.message || JSON.stringify(errorData);
        } catch (err) {
          errorMessage = "No JSON response (likely 403 or server issue)";
        }
        console.error("Login failed:", errorMessage);
        const errorData = await response.json();
        setError(errorData.message || "Login failed");
      }
    } catch (error) {
      console.error("Network error:", error);
    }

    console.log(formData.email + "     " + formData.password);
  };

  {
    error && (
      <Typography color="error" sx={{ mt: 1 }}>
        {error}
      </Typography>
    );
  }

  return (
    <Container maxWidth="xs">
      <Paper elevation={10} sx={{ marginTop: 8, padding: 2 }}>
        <Avatar
          sx={{
            mx: "auto",
            bgcolor: "secondary.main",
            textAlign: "center",
            mb: 1,
          }}
        ></Avatar>
        <Typography component="h1" variant="h5" sx={{ textAlign: "center" }}>
          Sign In
        </Typography>

        {/* //Box component that includes form to allow user to submit details */}

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            type="email"
            placeholder="Enter Email "
            fullWidth
            required
            autoFocus
            sx={{ mb: 2 }}
            value={formData.email} //get username value
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            } //
          ></TextField>
          <TextField
            type="password"
            placeholder="Enter Password "
            fullWidth
            required
            sx={{ mb: 2 }}
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 1 }}>
            Sign In
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default SignInPage;
