import { useEffect, useState } from "react";
import { useGamer } from "../GamerContext.tsx";
import { useNavigate, Link } from "react-router-dom";
import Loading from "./Loading.tsx";
import { showToast } from "../ToastHelper.ts";

const apiUrl: string = import.meta.env.VITE_API_URL;

export default function NewGame() {
  const {gamer} = useGamer();
  const [gameList, setGameList] = useState<Game[]>([]);
  const [userConsoleList, setUserConsoleList] = useState<UserConsoleWithConsoleData[]>([]);
  const [isLoading, setIsloading] = useState(true);
  const navigate = useNavigate();
  

  useEffect(() => {
    handlePageLoad();
  }, [isLoading]);

  async function handlePageLoad() {
    await handleFetchGames();
    await handleFetchUserConsoles();
  }

  async function handleFetchGames() {
    const response = await fetch(apiUrl + "/game", {
      credentials: "include"
    });

    if (response.status === 200) {
      const gameArray = await response.json();
      setGameList(gameArray);
    } else {
      showToast("error", "There was an error loading the games list");
    }
  }

  async function handleFetchUserConsoles() {
    const response = await fetch(apiUrl + `/gamer/${gamer?.id}/userconsole`, {
      credentials: "include"
    });

    if (response.status === 200) {
      const userConsoleArray = await response.json();
      setUserConsoleList(userConsoleArray);
    } else {
      showToast("error", "There was an error loading the user's consoles");
    }

    setIsloading(false);
  }

  async function handleAddGame(gamerID: number | undefined, gameName: string, consoleName: string, isOwned: boolean, isCompleted: boolean, isFavorite: boolean, personalRating: number | null, personalReview: string) {
    if (personalRating === 0) personalRating = null;
    const userConsoleID = userConsoleList.find((userConsole) => userConsole.name === consoleName)?.id;
    const gameID = gameList.find((game) => game.name === gameName)?.rawg_id;

    const response = await fetch(apiUrl + `/gamer/${gamerID}/usergame`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({gameID: gameID, userConsoleID: userConsoleID, isOwned: isOwned, isCompleted: isCompleted, isFavorite: isFavorite, personalRating: personalRating, personalReview: personalReview})
    });

    if (response.status === 201) {
      showToast("success", "Game added successfully");
      navigate("/");
    } else if (response.status === 400) {
      showToast("warn", "Invalid console or game selection");
    } else if (response.status === 403) {
      showToast("warn", "You have already added that game");
    } else {
      showToast("error", "There was an error adding your game");
    }
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <>
      <Link to="/" className="back-to-profile">Back to Profile</Link>
      { userConsoleList.length > 0 ? <form className="new-game" action="" onSubmit={(event) => {
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
          (form?.querySelector("textarea.personal-review") as HTMLInputElement)?.value
        )
      }}>
        <h2>New Game</h2>
        <div id="game-name" className="label-input-pair">
          <label htmlFor="game-name">Game<span className="mandatory">*</span></label>
          <input type="text" list="game-list" className="game-name" id="game-name" name="game-name" required/>
          <datalist id="game-list">
            {gameList.map((game) => <option key={"" + game.rawg_id} id={"" + game.rawg_id} value={game.name}>{game.name}</option>)}
          </datalist>
        </div>
        <div id="console-name" className="label-input-pair">
          <label htmlFor="console-name">Console<span className="mandatory">*</span></label>
          <input type="text" list="console-list" className="console-name" id="console-name" name="console-name" required/>
          <datalist id="console-list">
            {userConsoleList.map((userConsole) => <option key={"" + userConsole.id} id={"" + userConsole.id} value={userConsole.name}>{userConsole.name}</option>)}
          </datalist>
        </div>
        <div id="is-owned" className="label-input-pair">
          <label htmlFor="is-owned">I own it</label>
          <input type="checkbox" className="is-owned" id="is-owned" name="is-owned" defaultChecked/>
        </div>
        <div id="is-completed" className="label-input-pair">
          <label htmlFor="is-completed">I beat it</label>
          <input type="checkbox" className="is-completed" id="is-completed" name="is-completed"/>
        </div>
        <div id="is-favorite" className="label-input-pair">
          <label htmlFor="is-favorite">It's a favorite of mine</label>
          <input type="checkbox" className="is-favorite" id="is-favorite" name="is-favorite"/>
        </div>
        <div id="personal-rating" className="label-input-pair">
          <label htmlFor="personal-rating">Rating</label>
          <input type="number" step="0.00" min="1.00" max="5.00" className="personal-rating" id="personal-rating" name="personal-rating" placeholder="1.00 ~ 5.00"/>
        </div>
        <div id="personal-review" className="label-input-pair">
          <label htmlFor="personal-review">Review</label>
          <textarea className="personal-review" id="personal-review" name="personal-review" placeholder="Write your review here"/>
        </div>
        <button className="add-game form" type="submit">Add Game</button>
      </form>
      : <Link to="/add-console" className="no-consoles">Please add at least one console first</Link> }
    </>
  );
}