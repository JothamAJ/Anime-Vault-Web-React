import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
} from "@mui/material";
import AddToListButton from "./AddToListButton"; // adjust path as needed
import { Anime } from "../types/Anime";

type AnimeCardProps = {
  anime: Anime;
};

function AnimeCard({ anime }: AnimeCardProps) {
  return (
    <Card
      sx={{
        width: 240,
        height: "100%",
        borderRadius: 2,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "scale(1.05)",
          boxShadow: "0 6px 20px rgba(0, 0, 0, 0.2)",
        },
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        flexShrink: 0,
      }}
    >
      <CardMedia
        component="img"
        height="250"
        image={anime.image?.large}
        alt={anime.title}
        sx={{
          objectFit: "cover",
          borderRadius: "8px 8px 0 0",
          width: "100%",
        }}
      />
      <CardContent>
        <Typography
          variant="h6"
          component="div"
          sx={{ fontWeight: 600, fontSize: "1.1rem", mb: 1 }}
        >
          {anime.title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "#555",
            fontSize: "0.9rem",
            height: 45,
            overflow: "hidden",
          }}
        >
          {anime.synopsis.length > 150
            ? anime.synopsis.slice(0, 150) + "..."
            : anime.synopsis}
        </Typography>
      </CardContent>
      <CardActions>
        <AddToListButton
          anime={{
            ...anime,
            episodes: anime.episodes ?? 0,
            genres: anime.genres ?? "",
          }}
          category="Watching" // or dynamically pass if needed
        />
      </CardActions>
    </Card>
  );
}

export default AnimeCard;
