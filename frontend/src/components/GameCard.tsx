import { useState } from "react";
import { useGamer } from "../GamerContext.tsx";
import { useNavigate } from "react-router-dom";
import { showToast } from "../ToastHelper.ts";
import Icon from '@mdi/react';
import { mdiPencilOutline, mdiTrashCanOutline, mdiHeartSearch } from '@mdi/js';
import ConfirmationModal from "./ConfirmationModal.tsx";
const apiUrl: string = import.meta.env.VITE_API_URL;

type GameCardProps = {
  userGame: UserGameWithGameData,
  setRefresh?: (arg0: boolean) => void
}

export default function GameCard ({userGame, setRefresh}: GameCardProps) {
  const {gamer} = useGamer();
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const confirmDeleteMessage = "Are you sure you would like to delete this game?";

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    showToast("info", "Deletion aborted");
  }

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  async function handleDeleteGame() {  
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

  async function getRecommendation() {
    const response = await fetch(apiUrl + `/recommendation?rawg_id=${userGame.rawg_id}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      }
    });

    if (response.status === 200) {
      showToast("success", "Success");
      const reply = await response.json();
      console.log(reply);
    } else {
      showToast("error", "There was an error");
    }
  }

  return (
    <div className={ gamer?.id === userGame.gamer_id ? "own-card card" : "card" }>
      <div className="card-header">
        { gamer?.id === userGame.gamer_id && <div className="buttons">
          <button type="button" className="edit" onClick={handleEditGame}><Icon path={mdiPencilOutline} size={0.8} /></button>
          <button type="button" className="recommend" onClick={getRecommendation}><Icon path={mdiHeartSearch} size={0.8} /></button>
          <button type="button" className="delete" onClick={openModal}><Icon path={mdiTrashCanOutline} size={0.8} /></button>
        </div> }
        <div className="game-name">{userGame?.name}</div>
      </div>
      <img className="game-picture" src={userGame?.background_image_link} alt={"Photo of the game " + userGame?.name} onLoad={handleImageLoad}
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 1s ease-in-out',
          }}/>
      <div className="card-content">
        <div className="game-released">Released on {userGame?.released.toString().split("T")[0]}</div>
        <div className="game-official-rating">{userGame?.rating  + " stars (officially)"}</div>
        { userGame?.personal_rating && <div className="game-personal-rating">{userGame?.personal_rating + " stars (from me)"}</div> }
        { userGame?.personal_review && <div className="game-personal-review">{"Thoughts: " + userGame?.personal_review}</div> }
      </div>
      <div className="emoji-section">
        <div className="game-owned emoji">{userGame?.is_owned ? "💸" : "🙏"}</div>
        <div className="game-completed emoji">{userGame?.is_completed ? "💯" : "⏳"}</div>
        { userGame?.is_favorite && <div className="game-favorite favorite emoji">❤️</div> }
      </div>
      <ConfirmationModal isModalOpen={isModalOpen} closeModal={closeModal} handleClick={handleDeleteGame} confirmationMessage={confirmDeleteMessage} />
    </div>
  )
}