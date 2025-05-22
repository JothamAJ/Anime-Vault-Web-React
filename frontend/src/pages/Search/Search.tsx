import { Container, Typography, Box } from "@mui/material";
import { SearchBar } from "../../components/SearchBar";

const SearchPage = () => {
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
          Explore the Vault!
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Track, discover, and explore your favorite anime!
        </Typography>
        <SearchBar />
      </Box>
    </Container>
  );
};

export default SearchPage;
