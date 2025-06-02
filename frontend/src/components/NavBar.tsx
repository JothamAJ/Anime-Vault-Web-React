import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import Snackbar from "@mui/material/Snackbar";
import Box from "@mui/material/Box";
import { UserContext } from "../contexts/AuthContext";

function NavBar() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  // useContext to access user state from UserContext
  const { user, setUser } = useContext(UserContext);
  console.log(user);

  // Alert popover
  const [showAlert, setShowAlert] = useState(false);

  // logout functionality
  const logOut = async (e: React.FormEvent) => {
    e.preventDefault();
    // connect to flask backend using fetch and send state values
    try {
      const response = await fetch("http://127.0.0.1:5000/logout", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        //  clear user state after successful logout
        setUser({ id: "", email: "", username: "" });
        // set Alert to true
        setShowAlert(true);

        console.log("Logout successful!");

        // Navigate after 3 seconds
        setTimeout(() => {
          setShowAlert(false); // auto close snackbar
          navigate("/SignIn");
        }, 100);
      } else {
        let errorMessage = "Unknown error";

        try {
          const errorData = await response.json();
          errorMessage = errorData?.message || JSON.stringify(errorData);
        } catch (err) {
          errorMessage = "No JSON response (likely 403 or server issue)";
        }

        console.error("Logout failed:", errorMessage);
        setError(errorMessage); // set error state to display if needed
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  return (
    // conditional logic based on user state
    // if user is logged in, show logout button, else show sign in button
    <Navbar expand="lg" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand as={Link} to="/Home">
          AnimeVault
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/Search">
              Explore The Vault
            </Nav.Link>
            <Nav.Link as={Link} to="/Profile">
              View Profile
            </Nav.Link>

            {/* Only show Sign In or Logout based on user login state */}
            {user && user.id ? (
              <Nav.Link onClick={logOut}>Logout</Nav.Link>
            ) : (
              <Nav.Link as={Link} to="/SignIn">
                Sign In
              </Nav.Link>
            )}

            {/* Show alert using snackbar component after user successfully logs out */}
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
                  message="You have logged out!"
                  anchorOrigin={{ vertical: "top", horizontal: "center" }}
                />
              </Box>
            )}

            {/* Dropdown to access user anime lists */}
            {/* 🆕 This remains accessible regardless of auth — change if you want it protected */}
            <NavDropdown title="My List" id="my-list-dropdown">
              <NavDropdown.Item as={Link} to="/list/watching">
                Watching
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/list/completed">
                Completed
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/list/plan-to-watch">
                Plan to Watch
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/list/dropped">
                Dropped
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
