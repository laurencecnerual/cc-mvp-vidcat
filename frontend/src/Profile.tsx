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

  function generateConsoleCards() {
    return userConsoles.map((userConsole) => {
      let console = consoles.find((console) => userConsole.console_id === console.id);

      return (
        <div className="console-card card">
          <div className="console-name">{console?.name}</div>
          <div className="console-handheld">{console?.is_handheld ? "Handheld Console" : "Home Console"}</div>
          <div className="console-maker">By {console?.maker}</div>
          <div className="console-owned">{userConsole?.is_owned ? "Owned" : "Wanted"}</div>
          <div className="console-favorite favorite">{userConsole?.is_favorite ? "One of My Favorites" : ""}</div>
        </div>
      )
    })
  }

  function generateGameCards() {
    return userGames.map((userGame) => {
      let game = games.find((game) => userGame.game_id === game.rawg_id);

      return (
        <div className="game-card card">
          <div className="game-name">{game?.name}</div>
          <img className="game-picture" src={game?.background_image_link} alt={"Photo of the game " + game?.name} />
          <div className="game-owned">{userGame?.is_owned ? "Owned" : "Wanted"}</div>
          <div className="game-handheld">{userGame?.is_completed ? "Beaten" : "Non Yet Finished"}</div>
          <div className="game-favorite favorite">{userGame?.is_favorite ? "One of My Favorites" : ""}</div>
          <div className="game-official-rating">Official Rating: {game?.rating}</div>
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