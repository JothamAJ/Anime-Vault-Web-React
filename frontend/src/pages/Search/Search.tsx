import { Container, Typography, Box } from "@mui/material";
import { SearchBar } from "../../components/SearchBar";
import AnimeCard from "../../components/AnimeCard";
import { useEffect, useState } from "react";
import { Grid } from "@mui/material";

const SearchPage = () => {
  //Anime type
  type Anime = {
    id?: number;
    title: string;
    image: string;
    synopsis: string;
  };

  const [input, setInput] = useState(""); //user input
  const [animes, setAnimes] = useState<Anime[]>([]); //state veriable to hold fetched results

  //connect to flask backend and send query
  const fetchData = (query: string) => {
    fetch(`http://127.0.0.1:5000/search?query=${query}`)
      .then((response) => response.json())
      .then((data) => {
        //ensure query exists and matches anime
        const results = data.filter(
          (anime: { title: string }) =>
            anime?.title?.toLowerCase().includes(query.toLowerCase()) //optional chaining to access anime name
        );
        setAnimes(results); //save results
        console.log(results); // log filtered results
      })
      .catch((err) => console.error("Search error:", err));
  };

  const handleChange = (query: string) => {
    setInput(query);
    fetchData(query);
  };

  return (
    <Container maxWidth="md">
      <Grid
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
        <SearchBar input={input} onInputChange={handleChange} />

        {/* //display animes using card componenet, iterate over animes array using map  */}
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          {animes &&
            animes.length > 0 &&
            animes.map((anime, index) => (
              <AnimeCard
                key={anime.id || index}
                title={anime.title}
                image={anime.image}
                synopsis={anime.synopsis}
                onClick={() => console.log(`Clicked ${anime.title}`)}
              />
            ))}
        </Grid>
      </Grid>
    </Container>
  );
};

export default SearchPage;
