import { useNavigate, Link, useLocation } from "react-router-dom";
import { showToast } from "../ToastHelper";
import { useEffect, useState } from "react";
import Loading from "./Loading";

const apiUrl: string = import.meta.env.VITE_API_URL;

export default function ViewGame() {
  const navigate = useNavigate();
  const location = useLocation();
  const userGame = location.state.userGame;
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    handleFetchScreenshots();
  }, [loading])

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  async function handleFetchScreenshots() {
    const response = await fetch(apiUrl + `/game/${userGame.rawg_id}/screenshot`);

    if (response.status === 200) {
      const screenshotURLs = await response.json();
      setScreenshots(screenshotURLs);
    } else if (response.status === 404) {
      showToast("error", "Game not found");
    } else {
      showToast("error", "There was an error loading screenshots for the game");
    }

    setLoading(false);
  }

  if (loading) return <Loading />;

  return (
    <div className="view-game-page">
      <Link to="/" onClick={(e) => { e.preventDefault(); navigate(-1); }} className="back-to-profile">Back to Profile</Link>
        <h2 className="screenshots-title">{"Enter " + userGame.name}</h2>
        <div className="all-screenshots">
          {screenshots.map(screenshotURL => {
            return <img 
              className="game-screenshot" src={screenshotURL} 
              onLoad={handleImageLoad}
              style={{
                opacity: isLoaded ? 1 : 0,
                transition: 'opacity 1s ease-in-out',
              }} 
            /> 
          })}
        </div>
    </div>
  );
}