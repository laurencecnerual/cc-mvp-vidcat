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

export default function Profile({gamer}: ProfileProps) {
  const [userConsoles, setUserConsoles] = useState<UserConsole[]>([]);
  const [userGames, setUserGames] = useState<UserGame[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    handleLoading();
  }, [loading])

  async function handleLoading() {
    await handleFetchUserConsoles(gamer?.id);
    await handleFetchUserGames();
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

    console.log("Final userGameArray", userGameArray)
    setUserGames(userGameArray);
    setLoading(false);
  }

  return (
    <>
      <h1>{gamer?.username}'s Profile</h1>
      <div className="consoles-section">
        <h2>Consoles</h2>
        {userConsoles.map((userConsole) => (<div>{JSON.stringify(userConsole)}</div>))}
      </div>
      <div className="games-section">
        <h2>Games</h2>
        {userGames.map((userGame) => (<div>{JSON.stringify(userGame)}</div>))}
      </div>
    </>
  );
}