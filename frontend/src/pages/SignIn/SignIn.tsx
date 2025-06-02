import {
  Avatar,
  Box,
  Container,
  Paper,
  TextField,
  Typography,
  Button,
} from "@mui/material";

import { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { UserContext } from "../../contexts/AuthContext";
import { set } from "react-hook-form";

const SignInPage = () => {
  //username and password states
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  //Alert popover
  const [showAlert, setShowAlert] = useState(false);

  //useContext to access user state from UserContext
  const { setUser } = useContext(UserContext); // setUser function to update user state after login

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
        //set user state after successful login
        const userData = await response.json();
        setUser({
          id: userData.id,
          email: userData.email,
          username: userData.username,
        });

        console.log("User data set:", userData);

        setShowAlert(true); //set Alert to true

        console.log("Login successful!");

        setTimeout(() => {
          navigate("/Home");
        }, 3000);
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
          {/* Show alert using snackbar component after user successfully signs in */}
          {showAlert && (
            <Box
              sx={{
                position: "fixed",
                top: 20,
                left: 0,
                right: 0,
                display: "flex",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <Snackbar
                open={showAlert}
                autoHideDuration={3000} // in ms
                onClose={() => setShowAlert(false)}
                message="You successfully logged in!"
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
              />
            </Box>
          )}

          {/* Sign up button for a new user  */}
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Don't have an account?{" "}
            <Link
              to="/SignUp"
              style={{
                textDecoration: "none",
                color: "#1976d2",
                fontWeight: "bold",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.textDecoration = "underline")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.textDecoration = "none")
              }
            >
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default SignInPage;
