import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
const apiUrl: string = import.meta.env.VITE_API_URL;

export default function PublicProfile({}) {
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
    return <h1>Loading...</h1>
  }

  return (
    <>
      { validatedUsername ?
        <div className="public-profile">
          <h1>{`${username}'s Public Profile`}</h1>
          <h2>Consoles</h2>
          { userConsoles.length > 0 ? userConsoles.map(uc => <p key={uc.id}>{uc.name}</p>) : <p>No Consoles Registered</p> }
          <h2>Games</h2>
          { userGames.length > 0 ? userGames.map(ug => <p key={ug.id}>{ug.name}</p>) : <p>No Games Registered</p> }
        </div>
        : <h1>Resource Not Found</h1>
      }
    </>
  );
}