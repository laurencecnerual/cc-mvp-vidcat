import { useEffect, useState } from "react";
import { Gamer } from "./App";
const apiUrl: string = import.meta.env.VITE_API_URL;

type ProfileProps = {
  gamer: Gamer | null,
}

type UserConsole = {
  id: number,
  gamer_id: number,
  console_id: number,
  is_owned: boolean,
  is_favorite: boolean
}

type Console = {
  id: number,
  name: string,
  maker: string,
  release_year: Date,
  picture: BinaryData;
  is_handheld: boolean
}

type UserGame = {
  id: number,
  userconsole_id: number,
  game_id: number,
  is_owned: boolean,
  is_completed: boolean,
  is_favorite: boolean,
  personal_rating: number,
  personal_review: string
}

type Game = {
  rawg_id: number,
  name: string,
  lookup_name: string,
  released: Date,
  rating: number;
  background_image_link: string
}

export default function Profile({gamer}: ProfileProps) {
  const [userConsoles, setUserConsoles] = useState<UserConsole[]>([]);
  const [userGames, setUserGames] = useState<UserGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [consoles, setConsoles] = useState<Console[]>([]);
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    handleLoading();
  }, [loading])

  async function handleLoading() {
    await handleFetchUserConsoles(gamer?.id);
    await handleFetchUserGames();
    await handleFetchConsoles();
    await handleFetchGames();
  }

  async function handleFetchUserConsoles(gamerID: number | undefined) {
    const response = await fetch(apiUrl + `/gamer/${gamerID}/userconsole`, {
      credentials: "include"
    });

    if (response.status === 200) {
      const userConsoleArray = await response.json();
      setUserConsoles(userConsoleArray);
    } else {
      alert("There was an error loading the user's consoles");
    }
  }

  async function handleFetchUserGames() {
    let userGameArray: UserGame[] = [];

    for (let userConsole of userConsoles) {
      const response = await fetch(apiUrl + `/userconsole/${userConsole?.id}/usergame`, {
        credentials: "include"
      });
  
      if (response.status === 200) {
        const nextUserGameArray = await response.json();
        userGameArray = userGameArray.concat(nextUserGameArray);
      } else {
        alert("There was an error loading the user's games");
        return;
      }
    }

    setUserGames(userGameArray);
  }

  async function handleFetchConsoles() {
    let consoleArray: Console[] = [];

    for (let userConsole of userConsoles) {
      const response = await fetch(apiUrl + `/console/${userConsole?.console_id}`, {
        credentials: "include"
      });
  
      if (response.status === 200) {
        const nextConsole = await response.json();
        consoleArray.push(nextConsole);
      } else {
        alert("There was an error loading the console data");
        return;
      }
    }

    setConsoles(consoleArray);
  }

  async function handleFetchGames() {
    let gameArray: Game[] = [];

    for (let userGame of userGames) {
      const response = await fetch(apiUrl + `/game/${userGame?.game_id}`, {
        credentials: "include"
      });
  
      if (response.status === 200) {
        const nextGame = await response.json();
        gameArray.push(nextGame);
      } else {
        alert("There was an error loading the game data");
        return;
      }
    }

    setGames(gameArray);
    setLoading(false);
  }

  return (
    <>
      <h1>{gamer?.username}'s Profile</h1>
      <div className="consoles-section">
        <h2>Consoles</h2>
        {userConsoles.map((userConsole) => (<div>{JSON.stringify(userConsole)}</div>))}
        {consoles.map((console) => (<div>{JSON.stringify(console)}</div>))}
      </div>
      <div className="games-section">
        <h2>Games</h2>
        {userGames.map((userGame) => (<div>{JSON.stringify(userGame)}</div>))}
        {games.map((game) => (<div>{JSON.stringify(game)}</div>))}
      </div>
    </>
  );
}