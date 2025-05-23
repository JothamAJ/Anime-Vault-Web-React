import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import "./AnimeCard.css";

type AnimeCardProps = {
  title: string;
  image: string;
  synopsis: string;
  onClick: () => void;
};

function AnimeCard({ title, image, synopsis, onClick }: AnimeCardProps) {
  return (
    <Card style={{ width: "15rem" }}>
      <Card.Img
        className="anime-card-img"
        variant="top"
        height={300}
        src={image}
        alt={title}
      />
      <Card.Body>
        <Card.Title className="anime-card-title">{title}</Card.Title>
        <Card.Text className="anime-card-text">
          {synopsis.length > 150 ? synopsis.slice(0, 150) + "..." : synopsis}
        </Card.Text>
        <Button variant="primary" onClick={onClick}>
          View Details
        </Button>
      </Card.Body>
    </Card>
  );
}

export default AnimeCard;
