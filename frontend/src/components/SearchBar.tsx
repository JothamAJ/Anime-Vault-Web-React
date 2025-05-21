import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

export const SearchBar = () => {
  return (
    <Box sx={{ width: "100%", maxWidth: 500, mx: "auto" }}>
      <TextField
        id="outlined-basic"
        variant="outlined"
        fullWidth
        label="Explore the Vault..."
        sx={{
          backgroundColor: "white",
          borderRadius: 1,
          boxShadow: 2,
        }}
      />
    </Box>
  );
};
