//type to represent an anime item from the API
export type Anime = {
  id: number;
  title: string;
  main_picture: string;
  synopsis: string;
  episodes?: number;
  genres?: string;
};

// type to represent a user's anime list item
export type AnimeList = {
  id: number;
  title: string;
  main_picture: string;
  synopsis: string;
  episodes?: number;
  genres?: string;
  status: "Watching" | "Completed" | "Plan to Watch" | "Dropped";
};
