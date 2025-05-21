import { Container, Typography, Box } from "@mui/material";
import { SearchBar } from "../../components/SearchBar";

const HomePage = () => {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          textAlign: "center",
          mt: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
        }}
      >
        <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
          Welcome to Anime Vault!
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Track, discover, and explore your favorite anime!
        </Typography>

        <SearchBar />
      </Box>
    </Container>
  );
};

export default HomePage;
