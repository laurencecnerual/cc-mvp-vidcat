import { useState } from "react";
import { useGamer } from "../GamerContext.tsx";
import { useNavigate } from "react-router-dom";
import { showToast, removeToast } from "../ToastHelper.ts";
import Icon from '@mdi/react';
import { mdiPencilOutline, mdiTrashCanOutline, mdiRobotLoveOutline, mdiMagnify } from '@mdi/js';
import ConfirmationModal from "./ConfirmationModal.tsx";
const apiUrl: string = import.meta.env.VITE_API_URL;

type GameCardProps = {
  userGame: UserGameWithGameData,
  setRefresh?: (arg0: boolean) => void
}

type RecommendedGame = {
  name: string,
  release_year: number,
  consoles: string,
  reason: string
}

export default function GameCard ({userGame, setRefresh}: GameCardProps) {
  const {gamer} = useGamer();
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const buttonIconSize = 0.9;

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

  function handleViewGame() {
    navigate("/view-game", {
      state: { userGame: userGame }
    });
  }

  async function getRecommendation() {
    const loadingToastID = showToast("loading", "Generating recommendation...");

    const response = await fetch(apiUrl + `/recommendation?rawg_id=${userGame.rawg_id}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      }
    });

    if (response.status === 200) {
      const reply = await response.json();

      try {
        const recommendedGame: RecommendedGame = JSON.parse(reply);

        const consoleList = recommendedGame.consoles.split(", ");
        let availableOn: string;

        if (consoleList.length === 1) {
          availableOn = consoleList[0];
        } else if (consoleList.length === 2) {
          availableOn = consoleList[0] + " and " + consoleList[1];
        } else {
          consoleList[consoleList.length - 1] = "and " + consoleList[consoleList.length - 1];
          availableOn = consoleList.join(", ");
        }

        const recommendation = `If you like '${userGame.name}', you might also enjoy '${recommendedGame.name}' (${recommendedGame.release_year}), available on ${availableOn}. => ${recommendedGame.reason}`

        if (loadingToastID) {
          removeToast(loadingToastID);
        }

        showToast("recommendation", recommendation);
      } catch (err) {
        if (loadingToastID) {
          removeToast(loadingToastID);
        }

        showToast("error", "There was an issue with the reply received");
      }

    } else {
        if (loadingToastID) {
          removeToast(loadingToastID);
        }

        showToast("error", "There was an error getting recommendations");
    }
  }

  return (
    <div className={ gamer?.id === userGame.gamer_id ? "own-card card" : "other-card card" }>
      <div className="card-header">
        { gamer?.id === userGame.gamer_id && <div className="buttons">
          <button type="button" className="edit" onClick={handleEditGame}><Icon path={mdiPencilOutline} size={buttonIconSize} /></button>
          <button type="button" className="recommend" onClick={getRecommendation}><Icon path={mdiRobotLoveOutline} size={buttonIconSize} /></button>
          <button type="button" className="delete" onClick={openModal}><Icon path={mdiTrashCanOutline} size={buttonIconSize} /></button>
        </div> }
        <div className="game-name">{userGame?.name}</div>
      </div>
      <div className="game-picture-container">
        <img className="game-picture" loading="lazy" src={userGame?.background_image_link} alt={"Photo of the game " + userGame?.name} onClick={handleViewGame} onLoad={handleImageLoad}
            style={{
              opacity: isLoaded ? 1 : 0,
              transition: 'opacity 1s ease-in-out',
            }}
        />
        <div className="top-right-icon" onClick={handleViewGame}><Icon path={mdiMagnify} size={buttonIconSize} /></div>
      </div>
      <div className="card-content">
        { userGame?.released && <div className="game-released">Released {userGame?.released.toString().split("T")[0]}</div> }
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