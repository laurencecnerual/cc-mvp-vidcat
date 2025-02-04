import { useState, useEffect } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import ConsoleCard from './ConsoleCard';
import GameCard from './GameCard';
import Loading from "./Loading.tsx";

const apiUrl: string = import.meta.env.VITE_API_URL;

export default function PublicProfile() {
  const username = useLocation().pathname.slice(1);
  const [loading, setLoading] = useState(true);
  const [userConsoles, setUserConsoles] = useState<UserConsoleWithConsoleData[]>([]);
  const [userGames, setUserGames] = useState<UserGameWithGameData[]>([]);
  const [validatedUsername, setValidatedUsername] = useState<string>("");

  useEffect(() => {
    handleFetchProfile();
  }, [loading])

  async function handleFetchProfile() {
    const response = await fetch(apiUrl + `/profile/${username}`);

    if (response.status === 200) {
      const collectionObject = await response.json();
      setUserConsoles(collectionObject.userconsoles);
      setUserGames(collectionObject.usergames);
      setValidatedUsername(username);
    } else if (response.status !== 404) {
      alert("There was an error loading the user's profile");
    }

    setLoading(false);
  }

  if (loading) {
    return <Loading />
  }

  return (
    <>
      { validatedUsername ?
        <div className="public-profile">
          <h1>{`${username}'s Public Profile`}</h1>
          <h2>Consoles</h2>
          { userConsoles.length > 0 ? 
            <div className="games-list card-list">{ userConsoles.map(uc => <ConsoleCard key={uc.id} userConsole={uc} />) }</div> 
            : <p className="nothing-registered">No Consoles Registered</p> 
          }
          <h2>Games</h2>
          { userGames.length > 0 ? 
            <div className="consoles-list card-list">{ userGames.map(ug => <GameCard key={ug.id} userGame={ug} />) }</div> 
            : <p className="nothing-registered">No Games Registered</p> 
          }
        </div>
        : <Navigate to="/not-found" />
      }
    </>
  );
}