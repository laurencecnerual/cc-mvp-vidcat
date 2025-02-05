import { useState } from "react";
import { useGamer } from "../GamerContext.tsx";
import { useNavigate } from "react-router-dom";
import { showToast } from "../ToastHelper.ts";
const apiUrl: string = import.meta.env.VITE_API_URL;

type ConsoleCardProps = {
  userConsole: UserConsoleWithConsoleData,
  setRefresh?: (arg0: boolean) => void
}

export default function ConsoleCard ({userConsole, setRefresh}: ConsoleCardProps) {
  const {gamer} = useGamer();
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  async function handleDeleteConsole() {
    if (!window.confirm("Are you sure you would like to delete this console?\nNote that doing this will also delete any associated games.")) {
      return showToast("info", "Deletion aborted");
    }
    
    const response = await fetch(apiUrl + `/userConsole/${userConsole.id}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      showToast("success", "Console deleted successfully");
      setRefresh && setRefresh(true);
    } else {
      showToast("error", "There was an error deleting your console");
    }
  }

  function handleEditConsole() {
    navigate("/edit-console", {
      state: { userConsole: userConsole }
    });
  }

  return (
    <div className={ gamer ? "own-card card" : "card" }>
      <div className="card-header">
        { gamer && <div className="buttons">
          <button type="button" className="edit" onClick={handleEditConsole}>✎</button>
          <button type="button" className="delete" onClick={handleDeleteConsole}>×</button>
        </div> }
        <div className="console-name">{userConsole?.name}</div>
      </div>
      <img className="console-picture" src={userConsole?.picture} alt={"Photo of the console " + userConsole?.name} onLoad={handleImageLoad}
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 1s ease-in-out',
          }}/>
      <div className="card-content">
        <div className="console-handheld">{userConsole?.is_handheld ? "Handheld Console" : "Home Console"}</div>
        <div className="console-maker">By {userConsole?.maker}</div>
        <div className="console-release-year">Released in {userConsole?.release_year}</div>
      </div>
      <div className="emoji-section">
        <div className="console-owned emoji">{userConsole?.is_owned ? "💸" : "🙏"}</div>
        { userConsole?.is_favorite && <div className="console-favorite favorite emoji">❤️</div> } 
      </div>
    </div>
  )
}