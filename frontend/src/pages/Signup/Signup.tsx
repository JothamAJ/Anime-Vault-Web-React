import {
  Avatar,
  Container,
  Paper,
  Typography,
  Box,
  TextField,
} from "@mui/material";

import Button from "@mui/material/Button";
import { useState, useEffect } from "react";

const SignupPage = () => {
  //Form function to handle the user submit
  // Default variables, set to empty string to change later in function
  // sets form value and returns it throughout application
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password1: "",
    password2: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    //connect to flask backend using fetch and send state values
    const response = await fetch("http://localhost:5000/sign-up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify(formData), //send JSON data to backend
    });

    if (response.ok) {
      console.log("Signup successful!");
    } else {
      const errorData = await response.json();
      console.error("Signup failed:", errorData);
    }

    console.log(formData.email + formData.username + formData.password1);
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

        {/* //Box component that includes form to allow user to submit details */}

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            placeholder="Enter Username "
            fullWidth
            required
            autoFocus
            sx={{ mb: 2 }}
            value={formData.username} //get username value
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            } //update username field, gets new value user types using spread operator
          ></TextField>
          <TextField
            placeholder="Enter Email "
            fullWidth
            required
            autoFocus
            sx={{ mb: 2 }}
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          ></TextField>
          <TextField
            placeholder="Enter Password "
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
            placeholder="Repeat Password "
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
        </Box>
      </Paper>
    </Container>
  );
};

export default SignupPage;
