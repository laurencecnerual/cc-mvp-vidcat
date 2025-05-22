import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
const apiUrl: string = import.meta.env.VITE_API_URL;
import { useGamer } from "../GamerContext.tsx";
import GameCard from "./GameCard.tsx";
import ConsoleCard from "./ConsoleCard.tsx";
import Loading from "./Loading.tsx";
import { showToast } from "../ToastHelper.ts";
import SortAndFilter from "./SortAndFilter.tsx";
import Icon from '@mdi/react';
import { mdiArrowCollapseAll, mdiArrowExpandAll } from '@mdi/js';

export default function Profile() {
  const {gamer} = useGamer();
  const [userConsoles, setUserConsoles] = useState<UserConsoleWithConsoleData[]>([]);
  const [displayedUserConsoles, setDisplayedUserConsoles] = useState<UserConsoleWithConsoleData[]>([]);
  const [userGames, setUserGames] = useState<UserGameWithGameData[]>([]);
  const [displayedUserGames, setDisplayedUserGames] = useState<UserGameWithGameData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [consoleSectionOpen, setConsoleSectionOpen] = useState(true);
  const [gameSectionOpen, setGameSectionOpen] = useState(true);
  const toggleButtonSize = 0.9;

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
      showToast("error", "There was an error loading your consoles");
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
      showToast("error", "There was an error loading your games");
    }

    setLoading(false);
  }

  function generateConsoleGridAndCards() {
    if (displayedUserConsoles.length > 0) {
      return <div className="consoles-list card-list">
        { displayedUserConsoles.map((userConsole) => <ConsoleCard key={userConsole.id} userConsole={userConsole} setRefresh={setRefresh} />) }
      </div>
    } else {
      return <p className="over-filtered">Oops, it looks like you've filtered too much. Try removing some criteria.</p>
    }
  }

  function generateGameGridAndCards() {
    if (displayedUserGames.length > 0) {
      return <div className="games-list card-list">
        { displayedUserGames.map((userGame) => <GameCard key={userGame.id} userGame={userGame} setRefresh={setRefresh} />) }
      </div>
    } else {
      return <p className="over-filtered">Oops, it looks like you've filtered too much. Try removing some criteria.</p>
    }
  }

  function getUserPublicProfileURL() {
    navigator.clipboard.writeText(`${window.location.origin}/users/${gamer?.username}`);
    showToast("success", "Public profile URL copied to clipboard. Share it with your friends!");
  }

  function toggleCollapseExpand(currentValue: boolean, setState: Function) {
    setState(!currentValue);
  }

  if (loading) {
    return <Loading />
  }

  return (
    <>
      <div className="full-profile">
        <h1>Welcome, {gamer?.username}!</h1>
        <div className="get-my-url">
          <button className="get-my-url" type="button" onClick={getUserPublicProfileURL}>Get My Public Profile URL</button>
        </div>
        {
          consoleSectionOpen ?
          <h2 className="non-top-header">Your Consoles <button className="collapse-button" type="button" onClick={() => toggleCollapseExpand(consoleSectionOpen, setConsoleSectionOpen)}><Icon path={mdiArrowCollapseAll} size={toggleButtonSize} /></button></h2>
          : <h2 className="non-top-header">Your Consoles <button className="collapse-button" type="button" onClick={() => toggleCollapseExpand(consoleSectionOpen, setConsoleSectionOpen)}><Icon path={mdiArrowExpandAll} size={toggleButtonSize} /></button></h2>
        }
        { consoleSectionOpen && <div className="consoles-section">
          { (userConsoles.length > 0) && <SortAndFilter masterItems={userConsoles} setMasterItems={setUserConsoles} setDisplayedItems={setDisplayedUserConsoles} /> }
          { 
            userConsoles.length > 0 ? 
            generateConsoleGridAndCards() 
            : <p className="nothing-registered">No Consoles Registered - <Link to="/add-console">Add some</Link></p>
          }
        </div> }
        {
          gameSectionOpen ?
          <h2 className="non-top-header">Your Games <button className="collapse-button" type="button" onClick={() => toggleCollapseExpand(gameSectionOpen, setGameSectionOpen)}><Icon path={mdiArrowCollapseAll} size={toggleButtonSize} /></button></h2>
          : <h2 className="non-top-header">Your Games <button className="collapse-button" type="button" onClick={() => toggleCollapseExpand(gameSectionOpen, setGameSectionOpen)}><Icon path={mdiArrowExpandAll} size={toggleButtonSize} /></button></h2>
        }
        { gameSectionOpen && <div className="games-section">
          { (userGames.length > 0) && <SortAndFilter masterItems={userGames} setMasterItems={setUserGames} setDisplayedItems={setDisplayedUserGames} /> }
          { 
            userGames.length > 0 ? 
            generateGameGridAndCards() 
            : <p className="nothing-registered">No Games Registered - <Link to="/add-game">Add some</Link></p> 
          }
        </div> }
      </div>
    </>
  );
}