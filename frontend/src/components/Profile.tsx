import { useEffect, useState } from "react";
const apiUrl: string = import.meta.env.VITE_API_URL;

type ProfileProps = {
  gamer: Gamer | null,
}

export default function Profile({gamer}: ProfileProps) {
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
    return userConsoles.map((userConsole) => {
      return (
        <div key={userConsole.id} className="console-card card">
          <div className="console-name">{userConsole?.name}</div>
          <div className="console-handheld">{userConsole?.is_handheld ? "Handheld Console" : "Home Console"}</div>
          <div className="console-maker">By {userConsole?.maker}</div>
          <div className="console-owned">{userConsole?.is_owned ? "Owned" : "Wanted"}</div>
          <div className="console-favorite favorite">{userConsole?.is_favorite ? "One of My Favorites" : ""}</div>
        </div>
      )
    })
  }

  function generateGameCards() {
    return userGames.map((userGame) => {
      return (
        <div key={userGame.id} className="game-card card">
          <div className="game-name">{userGame?.name}</div>
          <img className="game-picture" src={userGame?.background_image_link} alt={"Photo of the game " + userGame?.name} />
          <div className="game-owned">{userGame?.is_owned ? "Owned" : "Wanted"}</div>
          <div className="game-handheld">{userGame?.is_completed ? "Beaten" : "Not Yet Finished"}</div>
          <div className="game-favorite favorite">{userGame?.is_favorite ? "One of My Favorites" : ""}</div>
          <div className="game-official-rating">Official Rating: {userGame?.rating}</div>
          <div className="game-personal-rating">{userGame?.personal_rating ? "My score: " + userGame?.personal_rating: ""}</div>
          <div className="game-personal-review">{userGame?.personal_review ? "My review: " + userGame?.personal_review : ""}</div>
        </div>
      )
    })
  }

  return (
    <>
      {loading ?
      <h2>Loading...</h2>
      : <div className="full-profile">
          <h1>{gamer?.username}'s Profile</h1>
          <div className="consoles-section">
            <h2>Consoles</h2>
            <div className="consoles-list card-list">
              {generateConsoleCards()}
            </div>
          </div>
          <div className="games-section">
            <h2>Games</h2>
            <div className="games-list card-list">
              {generateGameCards()}
            </div>
          </div>
      </div>}
    </>
  );
}