import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import SignInPage from "./pages/SignIn/SignIn";
import SignUpPage from "./pages/SignUp/SignUp";
import HomePage from "./pages/Home/Home";
import SearchPage from "./pages/Search/Search";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignInPage />} />
        <Route path="/SignIn" element={<SignInPage />} />
        <Route path="/SignUp" element={<SignUpPage />} />
        <Route path="/Home" element={<HomePage />} />
        <Route path="/Search" element={<SearchPage />} />
      </Routes>
    </Router>
  );
}

export default App;
