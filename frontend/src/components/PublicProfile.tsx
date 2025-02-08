import { useState, useEffect } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import ConsoleCard from './ConsoleCard';
import GameCard from './GameCard';
import Loading from "./Loading.tsx";
import { showToast } from '../ToastHelper.ts';

const apiUrl: string = import.meta.env.VITE_API_URL;

export default function PublicProfile() {
  const username = useLocation().pathname.slice(1);
  const [loading, setLoading] = useState(true);
  const [userConsoles, setUserConsoles] = useState<UserConsoleWithConsoleData[]>([]);
  const [userGames, setUserGames] = useState<UserGameWithGameData[]>([]);
  const [profilePicture, setProfilePicture] = useState<string>();
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
      setProfilePicture(collectionObject.profilePicture)
      setValidatedUsername(username);
    } else if (response.status !== 404) {
      showToast("error", "There was an error loading the user's profile");
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
          <h1>{`${validatedUsername}'s Public Profile`}</h1>
          { profilePicture && <img src={profilePicture} className="public-profile-picture" alt={validatedUsername + "'s profile picture"} /> }
          <h2 className="non-top-header">Consoles</h2>
          { userConsoles.length > 0 ? 
            <div className="games-list card-list">{ userConsoles.map(uc => <ConsoleCard key={uc.id} userConsole={uc} />) }</div> 
            : <p className="nothing-registered">No Consoles Registered</p> 
          }
          <h2 className="non-top-header">Games</h2>
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