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

type UserConsole = {
  id: number,
  gamer_id: number,
  console_id: number,
  is_owned: boolean,
  is_favorite: boolean
}

export default function NewGame({gamer, setAction}: NewGameProps) {
  const [gameList, setGameList] = useState<Game[]>([]);
  const [userConsoleList, setUserConsoleList] = useState<UserConsole[]>([]);

  useEffect(() => {
    handleFetchGames();
    handleFetchUserConsoles(gamer?.id)
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

  async function handleFetchUserConsoles(gamerID: number | undefined) {
    const response = await fetch(apiUrl + `/gamer/${gamerID}/userconsole`, {
      credentials: "include"
    });

    if (response.status === 200) {
      const userConsoleArray = await response.json();
      setUserConsoleList(userConsoleArray);
      console.log(userConsoleArray)
    } else {
      alert("There was an error loading the user's consoles");
    }
  }

  // async function handleAddGame(gamerID: number | undefined, consoleName: string, isOwned: boolean, isFavorite: boolean) {
  //   const consoleID = (consoleList.find((console) => console.name === consoleName))?.id

  //   const response = await fetch(apiUrl + `/gamer/${gamerID}/userconsole`, {
  //     method: "POST",
  //     credentials: "include",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({consoleID: consoleID, isOwned: isOwned, isFavorite: isFavorite})
  //   });

  //   if (response.status === 200) {
  //     const payload = await response.json();
  //     console.log("The following console has been added", payload);
  //     setAction("PROFILE");
  //   } else {
  //     alert("There was an error adding your console");
  //   }
  // }

  return (
    <>
      <div>{gamer?.username}'s New Game Page</div>
    </>
  );
}