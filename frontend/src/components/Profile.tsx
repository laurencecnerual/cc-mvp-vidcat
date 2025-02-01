import { useEffect, useState } from "react";
const apiUrl: string = import.meta.env.VITE_API_URL;
import { useGamer } from "../GamerContext.tsx";
import GameCard from "./GameCard.tsx";
import ConsoleCard from "./ConsoleCard.tsx";

export default function Profile() {
  const {gamer} = useGamer();
  const [userConsoles, setUserConsoles] = useState<UserConsoleWithConsoleData[]>([]);
  const [userGames, setUserGames] = useState<UserGameWithGameData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    handleLoading();
  }, [loading])

  async function handleLoading() {
    await handleFetchUserConsoles();
    await handleFetchUserGames();
  }

  async function handleFetchUserConsoles() {
    const response = await fetch(apiUrl + `/gamer/${gamer?.id}/userconsole`, {
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

    const response = await fetch(apiUrl + `/gamer/${gamer?.id}/usergame`, {
      credentials: "include"
    });

    if (response.status === 200) {
      const userGameArray = await response.json();
      setUserGames(userGameArray);
    } else {
      alert("There was an error loading the user's games");
    }

    setLoading(false);
  }

  function generateConsoleCards() {
    return userConsoles.map((userConsole) => <ConsoleCard key={userConsole.id} userConsole={userConsole} />);
  }

  function generateGameCards() {
    return userGames.map((userGame) => <GameCard key={userGame.id} userGame={userGame} />);
  }

  if (loading) {
    <h2>Loading...</h2>
  }

  return (
    <>
      <div className="full-profile">
        <h1>Welcome, {gamer?.username}!</h1>
        <div className="consoles-section">
          <h2>Your Consoles</h2>
          <div className="consoles-list card-list">
            { userConsoles.length > 0 ? generateConsoleCards() : <p>No Consoles Registered</p> }
          </div>
        </div>
        <div className="games-section">
          <h2>Your Games</h2>
          <div className="games-list card-list">
            { userGames.length > 0 ? generateGameCards() : <p>No Games Registered</p> }
          </div>
        </div>
      </div>
    </>
  );
}