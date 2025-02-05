import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
const apiUrl: string = import.meta.env.VITE_API_URL;
import { useGamer } from "../GamerContext.tsx";
import GameCard from "./GameCard.tsx";
import ConsoleCard from "./ConsoleCard.tsx";
import Loading from "./Loading.tsx";
import { showToast } from "../ToastHelper.ts";

export default function Profile() {
  const {gamer} = useGamer();
  const [userConsoles, setUserConsoles] = useState<UserConsoleWithConsoleData[]>([]);
  const [userGames, setUserGames] = useState<UserGameWithGameData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    handleLoading();
    setRefresh(false);
  }, [loading, refresh])

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
      showToast("error", "There was an error loading the user's consoles");
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
      showToast("error", "There was an error loading the user's games");
    }

    setLoading(false);
  }

  function generateConsoleCards() {
    return userConsoles.map((userConsole) => <ConsoleCard key={userConsole.id} userConsole={userConsole} setRefresh={setRefresh} />);
  }

  function generateGameCards() {
    return userGames.map((userGame) => <GameCard key={userGame.id} userGame={userGame} setRefresh={setRefresh} />);
  }

  if (loading) {
    return <Loading />
  }

  return (
    <>
      <div className="full-profile">
        <h1>Welcome, {gamer?.username}!</h1>
        <div className="consoles-section">
          <h2>Your Consoles</h2>
          { userConsoles.length > 0 ? <div className="consoles-list card-list">
            { generateConsoleCards() }
          </div> : <p className="nothing-registered">No Consoles Registered - <Link to="/add-console">Add some</Link></p> }
        </div>
        <div className="games-section">
          <h2>Your Games</h2>
          { userGames.length > 0 ? <div className="games-list card-list">
            { generateGameCards() }
          </div> : <p className="nothing-registered">No Games Registered - <Link to="/add-game">Add some</Link></p> }
        </div>
      </div>
    </>
  );
}