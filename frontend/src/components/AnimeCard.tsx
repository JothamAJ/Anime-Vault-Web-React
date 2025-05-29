import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
} from "@mui/material";

//Component to display a single anime card
type AnimeCardProps = {
  title: string;
  image: string;
  synopsis: string;
  onClick: () => void;
};

function AnimeCard({ title, image, synopsis, onClick }: AnimeCardProps) {
  return (
    // Card component with hover effect and styling - hover and transitioning too
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
      {/* Anime image */}
      <CardMedia
        component="img"
        height="250"
        image={image}
        alt={title}
        sx={{
          objectFit: "cover",
          borderRadius: "8px 8px 0 0",
          width: "100%",
        }}
      />
      {/* Card content with title and synopsis (for now) */}
      <CardContent>
        <Typography
          variant="h6"
          component="div"
          sx={{ fontWeight: 600, fontSize: "1.1rem", mb: 1 }}
        >
          {title}
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
          {/* {synopsis.length > 150 ? synopsis.slice(0, 150) + "..." : synopsis} */}
          Synopsis....
        </Typography>
      </CardContent>

      {/* View details button - change to add to list - view details through popover */}
      <CardActions>
        <Button size="small" onClick={onClick}>
          View Details
        </Button>
      </CardActions>
    </Card>
  );
}

export default AnimeCard;
