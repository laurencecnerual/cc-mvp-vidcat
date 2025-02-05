import { useState } from "react";
import { useGamer } from "../GamerContext.tsx";
import { useNavigate } from "react-router-dom";
import { showToast } from "../ToastHelper.ts";
const apiUrl: string = import.meta.env.VITE_API_URL;

type GameCardProps = {
  userGame: UserGameWithGameData,
  setRefresh?: (arg0: boolean) => void
}

export default function GameCard ({userGame, setRefresh}: GameCardProps) {
  const {gamer} = useGamer();
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  async function handleDeleteGame() {
    if (!window.confirm("Are you sure you would like to delete this game?")) {
      return showToast("info", "Deletion aborted");
    }
    
    const response = await fetch(apiUrl + `/usergame/${userGame.id}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      showToast("success", "Game deleted successfully");
      setRefresh && setRefresh(true);
    } else {
      showToast("error", "There was an error deleting your game");
    }
  }

  function handleEditGame() {
    navigate("/edit-game", {
      state: { userGame: userGame }
    });
  }

  return (
    <div className={ gamer ? "own-card card" : "card" }>
      { gamer && <div className="buttons">
        <button type="button" className="edit" onClick={handleEditGame}>✎</button>
        <button type="button" className="delete" onClick={handleDeleteGame}>×</button>
      </div> }
      <div className="game-name">{userGame?.name}</div>
      <img className="game-picture" src={userGame?.background_image_link} alt={"Photo of the game " + userGame?.name} onLoad={handleImageLoad}
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 1s ease-in-out',
        }}/>
      <div className="game-released">Released on {userGame?.released.toString().split("T")[0]}</div>
      <div className="game-owned">{userGame?.is_owned ? "Owned" : "Wanted"}</div>
      <div className="game-handheld">{userGame?.is_completed ? "Beaten" : "Not Yet Finished"}</div>
      <div className="game-official-rating">Official Rating: {userGame?.rating}</div>
      <div className="game-personal-rating">{userGame?.personal_rating ? "My score: " + userGame?.personal_rating : ""}</div>
      <div className="game-personal-review">{userGame?.personal_review ? "My review: " + userGame?.personal_review : ""}</div>
      <div className="game-favorite favorite">{userGame?.is_favorite ? "❤" : ""}</div>
    </div>
  )
}