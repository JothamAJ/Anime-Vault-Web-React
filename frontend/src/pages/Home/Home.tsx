import { Container, Typography, Box } from "@mui/material";
import { SearchBar } from "../../components/SearchBar";
import AnimeCard from "../../components/AnimeCard";
import { useEffect, useState } from "react";
import { Grid } from "@mui/material";

const HomePage = () => {
  //Loading state
  const [isLoading, setIsLoading] = useState(true);

  //Anime type
  type Anime = {
    id?: number;
    title: string;
    image: string;
    synopsis: string;
  };

  //Ranking type

  //state veriable to hold fetched results from list of anime objects above
  //setAnimes updates the anime list after fetching from API
  // const [animes, setAnimes] = useState<Anime[]>([]);

  //Get multiple ranking types
  const [popularAnime, setPopularAnime] = useState<Anime[]>([]);
  const [upcomingAnime, setUpcomingAnime] = useState<Anime[]>([]);
  const [favoriteAnime, setFavoriteAnime] = useState<Anime[]>([]);
  const [allAnime, setAllAnime] = useState<Anime[]>([]);
  const [airingAnime, setAiringAnime] = useState<Anime[]>([]);

  //get multiple API clls
  useEffect(() => {
    function getData() {
      let firstAPICall = fetch(`http://127.0.0.1:5000/ranking/bypopularity`);
      let secondAPICall = fetch(`http://127.0.0.1:5000/ranking/upcoming`);
      let thirdAPICall = fetch(`http://127.0.0.1:5000/ranking/all`);
      let fourthAPICall = fetch(`http://127.0.0.1:5000/ranking/airing`);
      let fifthAPICall = fetch(`http://127.0.0.1:5000/ranking/favorite`);
      //promise is used to wait for fetches to be completed
      Promise.all([
        firstAPICall,
        secondAPICall,
        thirdAPICall,
        fourthAPICall,
        fifthAPICall,
      ])
        //once promise is completed and reponses is back, parse both in json
        .then((responses) => Promise.all(responses.map((res) => res.json())))
        .then((finalVals) => {
          // set and update state
          setPopularAnime(finalVals[0]);
          setUpcomingAnime(finalVals[1]);
          setFavoriteAnime(finalVals[2]);
          setAllAnime(finalVals[3]);
          setAiringAnime(finalVals[4]);
          setIsLoading(false); //set loading to false when we have data

          // set state
          console.log("Popular:", finalVals[0]);
          console.log("Upcoming:", finalVals[1]);
        })
        .catch((err) => console.error("Fetch error:", err));
    }
    getData();
  }, []);

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          textAlign: "center",
          mt: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
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
        <Box
          sx={{
            display: "flex",
            gap: 2,
            overflowX: "auto",
            width: "100%",
            pb: 2,
            borderRadius: 1,
            scrollSnapType: "x mandatory",
          }}
        >
          {/* //display animes using card componenet, iterate over animes array using map  */}
          {isLoading && <div>Loading....</div>}
          {popularAnime.map((anime, index) => (
            <AnimeCard
              key={anime.id || index}
              title={anime.title}
              image={anime.image}
              synopsis={anime.synopsis}
              onClick={() => console.log(`Clicked ${anime.title}`)}
            />
          ))}
        </Box>

        <Typography variant="h5" component="h1">
          Top Upcoming Anime
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            overflowX: "auto",
            width: "100%",
            pb: 2,
            borderRadius: 1,
            scrollSnapType: "x mandatory",
          }}
        >
          {/* //display animes using card componenet, iterate over animes array using map  */}

          {upcomingAnime.map((anime, index) => (
            <AnimeCard
              key={anime.id || index}
              title={anime.title}
              image={anime.image}
              synopsis={anime.synopsis}
              onClick={() => console.log(`Clicked ${anime.title}`)}
            />
          ))}
        </Box>

        <Typography variant="h5" component="h1">
          Top Favorite Anime
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            overflowX: "auto",
            width: "100%",
            pb: 2,
            borderRadius: 1,
            scrollSnapType: "x mandatory",
          }}
        >
          {/* //display animes using card componenet, iterate over animes array using map  */}

          {favoriteAnime.map((anime, index) => (
            <AnimeCard
              key={anime.id || index}
              title={anime.title}
              image={anime.image}
              synopsis={anime.synopsis}
              onClick={() => console.log(`Clicked ${anime.title}`)}
            />
          ))}
        </Box>

        <Typography variant="h5" component="h1">
          Top Airing Anime
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            overflowX: "auto",
            width: "100%",
            pb: 2,
            borderRadius: 1,
            scrollSnapType: "x mandatory",
          }}
        >
          {/* //display animes using card componenet, iterate over animes array using map  */}

          {airingAnime.map((anime, index) => (
            <AnimeCard
              key={anime.id || index}
              title={anime.title}
              image={anime.image}
              synopsis={anime.synopsis}
              onClick={() => console.log(`Clicked ${anime.title}`)}
            />
          ))}
        </Box>

        <Typography variant="h5" component="h1">
          All Anime
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            overflowX: "auto",
            width: "100%",
            pb: 2,
            borderRadius: 1,
            scrollSnapType: "x mandatory",
          }}
        >
          {/* //display animes using card componenet, iterate over animes array using map  */}

          {allAnime.map((anime, index) => (
            <AnimeCard
              key={anime.id || index}
              title={anime.title}
              image={anime.image}
              synopsis={anime.synopsis}
              onClick={() => console.log(`Clicked ${anime.title}`)}
            />
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default HomePage;
