import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import React, { useState } from "react";

export const SearchBar = () => {
  const [input, setInput] = useState("");

  const fetchData = (query: string) => {
    fetch(`http://127.0.0.1:5000/search?query=${query}`)
      .then((response) => response.json())
      .then((data) => {
        //ensure query exists and matches anime
        const results = data.filter(
          (anime: { title: string }) =>
            anime?.title?.toLowerCase().includes(query.toLowerCase()) //optional chaining to access anime name
        );
        console.log(results); // log filtered results
      })
      .catch((err) => console.error("Search error:", err));
  };

  const handleChange = (query: string) => {
    setInput(query);
    fetchData(query);
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 500, mx: "auto" }}>
      <TextField
        id="outlined-basic"
        variant="outlined"
        fullWidth
        label="Explore the Vault..."
        value={input}
        onChange={(e) => handleChange(e.target.value)}
        sx={{
          backgroundColor: "white",
          borderRadius: 1,
          boxShadow: 2,
        }}
      />
    </Box>
  );
};
