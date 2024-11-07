import { useEffect, useState } from "react";
import { Gamer } from "./App";
const apiUrl: string = import.meta.env.VITE_API_URL;

type NewGameProps = {
  gamer: Gamer | null,
  setAction: Function
}

type Game = {
  rawg_id: number,
  name: string,
  lookup_name: string,
  released: Date,
  rating: number;
  background_image_link: string
}

type UserConsole = {
  id: number,
  gamer_id: number,
  console_id: number,
  is_owned: boolean,
  is_favorite: boolean
}

type ConsoleNameIDMapping = {
  id: number,
  name: string
}

export default function NewGame({gamer, setAction}: NewGameProps) {
  const [gameList, setGameList] = useState<Game[]>([]);
  const [userConsoleList, setUserConsoleList] = useState<UserConsole[]>([]);
  const [consoleNameIDMapping, setConsoleNameIDMapping] = useState<ConsoleNameIDMapping[]>([]);
  const [isLoading, setIsloading] = useState(true);

  useEffect(() => {
    handlePageLoad();
  }, [isLoading]);

  async function handlePageLoad() {
    await handleFetchGames();
    await handleFetchUserConsoles(gamer?.id);
    await handleCreateConsoleDataMapping();
  }

  async function handleFetchGames() {
    const response = await fetch(apiUrl + "/game", {
      credentials: "include"
    });

    if (response.status === 200) {
      const gameArray = await response.json();
      setGameList(gameArray);
    } else {
      alert("There was an error loading the games list");
    }
  }

  async function handleFetchUserConsoles(gamerID: number | undefined) {
    const response = await fetch(apiUrl + `/gamer/${gamerID}/userconsole`, {
      credentials: "include"
    });

    if (response.status === 200) {
      const userConsoleArray = await response.json();
      setUserConsoleList(userConsoleArray);
    } else {
      alert("There was an error loading the user's consoles");
    }
  }

  async function handleCreateConsoleDataMapping() {
    const consoleDataMapping = await Promise.all(userConsoleList.map(async (userConsole) => await handleFetchConsoleName(userConsole.console_id) as ConsoleNameIDMapping));
    setConsoleNameIDMapping(consoleDataMapping);
    setIsloading(false);
  }

  async function handleFetchConsoleName(consoleID: number | undefined) {
    const response = await fetch(apiUrl + `/console/${consoleID}`, {
      credentials: "include"
    });

    if (response.status === 200) {
      const targetConsole = await response.json();
      const consoleIDAndNamePair = {
          id: targetConsole.id,
          name: targetConsole.name
      }
      return consoleIDAndNamePair;
    } else {
      alert("There was an error loading console data");
    }
  }

  async function handleAddGame(gamerID: number | undefined, gameName: string, consoleName: string, isOwned: boolean, isCompleted: boolean, isFavorite: boolean, personalRating: number, personalReview: string) {
    const consoleID = (consoleNameIDMapping.find((console) => console.name === consoleName))?.id;
    const userConsoleID = userConsoleList.find((userConsole) => userConsole.console_id === consoleID)?.id;
    const gameID = gameList.find((game) => game.name === gameName)?.rawg_id;

    const response = await fetch(apiUrl + `/gamer/${gamerID}/usergame`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({gameID: gameID, userConsoleID: userConsoleID, isOwned: isOwned, isCompleted: isCompleted, isFavorite: isFavorite, personalRating: personalRating, personalReview: personalReview})
    });

    if (response.status === 200) {
      const payload = await response.json();
      console.log("The following game has been added", payload);
      setAction("PROFILE");
    } else {
      alert("There was an error adding your game");
    }
  }

  return (
    <>
      {
      isLoading ? 
      (<h2>Loading...</h2>)
      : (<form className="new-game" action="" onSubmit={(event) => {
        event.preventDefault(); 
        let form = document.querySelector("form"); 
        handleAddGame
        (
          gamer?.id,
          (form?.querySelector("input.game-name") as HTMLInputElement).value,
          (form?.querySelector("input.console-name") as HTMLInputElement).value,
          (form?.querySelector("input.is-owned") as HTMLInputElement)?.checked,
          (form?.querySelector("input.is-completed") as HTMLInputElement)?.checked,
          (form?.querySelector("input.is-favorite") as HTMLInputElement)?.checked,
          Number((form?.querySelector("input.personal-rating") as HTMLInputElement)?.value),
          (form?.querySelector("input.personal-review") as HTMLInputElement)?.value
        )
      }}>
        <div id="game-name">
          <h2>New Game</h2>
          <label htmlFor="game-name">Game</label>
          <input type="text" list="game-list" className="game-name" id="game-name" name="game-name" required/>
          <datalist id="game-list">
            {gameList.map((game) => <option id={"" + game.rawg_id} value={game.name}>{game.name}</option>)}
          </datalist>
        </div>
        <div id="console-name">
          <label htmlFor="console-name">Console</label>
          <input type="text" list="console-list" className="console-name" id="console-name" name="console-name" required/>
          <datalist id="console-list">
            {consoleNameIDMapping.map((console) => <option id={"" + console.id} value={console.name}>{console.name}</option>)}
          </datalist>
        </div>
        <div id="is-owned">
          <label htmlFor="is-owned">I own this game</label>
          <input type="checkbox" className="is-owned" id="is-owned" name="is-owned" defaultChecked/>
        </div>
        <div id="is-completed">
          <label htmlFor="is-completed">I have beaten this game</label>
          <input type="checkbox" className="is-completed" id="is-completed" name="is-completed"/>
        </div>
        <div id="is-favorite">
          <label htmlFor="is-favorite">This game is one of my favorites</label>
          <input type="checkbox" className="is-favorite" id="is-favorite" name="is-favorite"/>
        </div>
        <div id="personal-rating">
          <label htmlFor="personal-rating">Rating</label>
          <input type="number" step="0.01" className="personal-rating" id="personal-rating" name="personal-rating" placeholder="0.00 ~ 5.00"/>
        </div>
        <div id="personal-review">
          <label htmlFor="personal-review">Review</label>
          <input type="text" className="personal-review" id="personal-review" name="personal-review" placeholder="Write your review here"/>
        </div>
        <button className="login" type="submit">Add Game</button>
        <div onClick={() => {setAction("PROFILE")}}><a href="#">Back to Profile</a></div>
      </form>)}
    </>
  );
}