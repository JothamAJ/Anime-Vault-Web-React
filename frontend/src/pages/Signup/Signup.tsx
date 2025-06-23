import {
  Avatar,
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Alert,
} from "@mui/material";

import Button from "@mui/material/Button";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";

const SignUpPage = () => {
  //Form function to handle the user submit
  // Default variables, set to empty string to change later in function
  // sets form value and returns it throughout application

  //error message state to display error messages
  const [error, setError] = useState(""); //error state to display error messages

  //Alert popover
  const [showAlert, setShowAlert] = useState(false);

  //navigate user after successful signup
  let navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password1: "",
    password2: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    //connect to flask backend using fetch and send state values

    //password validation
    if (formData.password1 !== formData.password2) {
      console.error("Passwords do not match.");
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        mode: "cors",
        credentials: "include",
        body: JSON.stringify(formData),
      });

      //check if error response
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Signup failed:", errorData);
        setError(errorData.message || "Signup failed");
        return;
      }

      //if response is ok, set alert to true and navigate to home page
      console.log("Signup successful!");
      setShowAlert(true); //set Alert to true
      setTimeout(() => {
        navigate("/Home");
      }, 2000); // wait 2 seconds before navigating
    } catch (error) {
      console.error("Network error:", error);
      setError("Network error. Please try again.");
    }

    console.log(
      formData.email +
        "     " +
        formData.username +
        "     " +
        formData.password1
    );
  };

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
          Sign Up
        </Typography>

        {/* Display error message if there is an error */}
        {error && (
          <Typography color="error" sx={{ mt: 1, textAlign: "center" }}>
            {error}
          </Typography>
        )}

        {/* //Box component that includes form to allow user to submit details */}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            label="Username"
            placeholder="Enter Username"
            fullWidth
            required
            autoFocus
            sx={{ mb: 2 }}
            value={formData.username} //get username value
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            } //update username field, gets new value user types using spread operator
          />
          <TextField
            label="Email"
            placeholder="Enter Email"
            fullWidth
            required
            sx={{ mb: 2 }}
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <TextField
            label="Password"
            placeholder="Enter Password"
            fullWidth
            required
            type="password"
            sx={{ mb: 2 }}
            value={formData.password1}
            onChange={(e) =>
              setFormData({ ...formData, password1: e.target.value })
            }
          />
          <TextField
            label="Confirm Password"
            placeholder="Repeat Password"
            fullWidth
            required
            type="password"
            sx={{ mb: 2 }}
            value={formData.password2}
            onChange={(e) =>
              setFormData({ ...formData, password2: e.target.value })
            }
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 1 }}>
            Sign Up
          </Button>

          {/* Show alert after user successfully signs up */}
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
              <Alert
                severity="success"
                onClose={() => setShowAlert(false)}
                sx={{ width: "fit-content" }}
              >
                Signup Successful!
              </Alert>
            </Box>
          )}

          {/* Sign in button for a current user  */}
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Already have an account?{" "}
            <Link
              to="/SignIn"
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
              Sign In
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default SignUpPage;
