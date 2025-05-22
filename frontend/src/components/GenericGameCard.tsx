import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from '@mdi/react';
import { mdiMagnify } from '@mdi/js';

type GenericGameCardProps = {
  game: Game
}

export default function GenericGameCard ({game}: GenericGameCardProps) {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  function handleViewGame(game: Game) {
    navigate("/view-game", {
      state: { userGame: game }
    });
  }

  return (
    <div className="card generic-card">
      <div className="game-name">{game.name}</div>
            <div className="game-picture-container">
              <img className="game-picture" src={game.background_image_link} alt={"Photo of the game " + game.name} loading="lazy" onClick={() => handleViewGame(game)} onLoad={handleImageLoad}
                  style={{
                    opacity: isLoaded ? 1 : 0,
                    transition: 'opacity 1s ease-in-out',
                  }}
              />
              <div className="top-right-icon" onClick={() => handleViewGame(game)}><Icon path={mdiMagnify} size={0.9} /></div>
            </div>
    </div>
  )
}