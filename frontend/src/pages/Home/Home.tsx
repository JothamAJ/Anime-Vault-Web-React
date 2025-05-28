import { Container, Typography, Box } from "@mui/material";
import { SearchBar } from "../../components/SearchBar";
import AnimeCard from "../../components/AnimeCard";
import { useEffect, useState } from "react";
import { Grid } from "@mui/material";

const HomePage = () => {
  //Anime type
  type Anime = {
    id?: number;
    title: string;
    image: string;
    synopsis: string;
  };

  const [animes, setAnimes] = useState<Anime[]>([]); //state veriable to hold fetched results

  //connect to flask backend and send query
  //Renders each time the homepage is loaded
  useEffect(() => {
    fetch(`http://127.0.0.1:5000/ranking/bypopularity`) //returns a promise
      .then((response) => response.json()) //passes json into javascript object
      .then((data) => {
        setAnimes(data); // set the fetched anime data
        console.log(data);
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);

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

        <Typography variant="h5" component="h1">
          Top Popular Anime
        </Typography>

        {/* //display animes using card componenet, iterate over animes array using map  */}
        <Grid
          container
          wrap="nowrap"
          columnSpacing={2}
          sx={{ overflowX: "auto" }}
        >
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
      </Box>
    </Container>
  );
};

export default HomePage;
