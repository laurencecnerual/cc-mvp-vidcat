import { useEffect, useState } from "react";
import { Gamer } from "./App";
const apiUrl: string = import.meta.env.VITE_API_URL;

type NewGameProps = {
  gamer: Gamer | null,
  setAction: Function
}

type Game = {
  id: number,
  name: string,
  lookup_name: string,
  released: Date,
  rating: number;
  background_image_link: string
}

export default function NewGame({gamer, setAction}: NewGameProps) {
  const [gameList, setGameList] = useState<Game[]>([]);

  useEffect(() => {
    handleFetchGames();
  }, []);

  async function handleFetchGames() {
    const response = await fetch(apiUrl + "/game", {
      credentials: "include"
    });

    if (response.status === 200) {
      const gameArray = await response.json();
      setGameList(gameArray);
    } else {
      alert("There was an error loading the games list");
    }
  }

  return (
    <>
      <div>{gamer?.username}'s New Game Page</div>
    </>
  );
}