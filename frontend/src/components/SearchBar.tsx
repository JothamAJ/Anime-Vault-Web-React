import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import React, { useState } from "react";

interface SearchBarProps {
  input: string;
  onInputChange: (query: string) => void;
}

export const SearchBar = ({ input, onInputChange }: SearchBarProps) => {
  return (
    <Box sx={{ width: "100%", maxWidth: 500, mx: "auto" }}>
      <TextField
        id="outlined-basic"
        variant="outlined"
        fullWidth
        label="Explore the Vault..."
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
        sx={{
          backgroundColor: "white",
          borderRadius: 1,
          boxShadow: 2,
        }}
      />
    </Box>
  );
};
