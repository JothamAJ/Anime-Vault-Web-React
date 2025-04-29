import {
  Avatar,
  Container,
  Paper,
  Typography,
  Box,
  TextField,
} from "@mui/material";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Button from "@mui/material/Button";

const SignupPage = () => {
  //Form function to handle the user submit
  const handleSubmit = () => console.log("SignUp");

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
          ></TextField>
          <TextField
            placeholder="Enter Email "
            fullWidth
            required
            autoFocus
            sx={{ mb: 2 }}
          ></TextField>
          <TextField
            placeholder="Enter Password "
            fullWidth
            required
            type="password"
            sx={{ mb: 2 }}
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
