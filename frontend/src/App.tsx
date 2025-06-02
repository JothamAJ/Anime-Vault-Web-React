import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; //for basic navbar
import SignInPage from "./pages/SignIn/SignIn";
import SignUpPage from "./pages/SignUp/SignUp";
import HomePage from "./pages/Home/Home";
import SearchPage from "./pages/Search/Search";
import ProfilePage from "./pages/Profile/Profile";
import NavBar from "./components/NavBar";
import UserProvider from "./contexts/AuthContext";

function App() {
  return (
    <UserProvider>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<SignInPage />} />
          <Route path="/SignIn" element={<SignInPage />} />
          <Route path="/SignUp" element={<SignUpPage />} />
          <Route path="/Home" element={<HomePage />} />
          <Route path="/Profile" element={<ProfilePage />} />
          <Route path="/Search" element={<SearchPage />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
