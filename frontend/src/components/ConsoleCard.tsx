import { useGamer } from "../GamerContext.tsx";
import { useNavigate } from "react-router-dom";
const apiUrl: string = import.meta.env.VITE_API_URL;

type ConsoleCardProps = {
  userConsole: UserConsoleWithConsoleData,
  setRefresh?: (arg0: boolean) => void
}

export default function ConsoleCard ({userConsole, setRefresh}: ConsoleCardProps) {
  const {gamer} = useGamer();
  const navigate = useNavigate();

  async function handleDeleteConsole() {
    if (!window.confirm("Are you sure you would like to delete this console?\nNote that doing this will also delete any associated games.")) {
      return alert("Deletion aborted.");
    }
    
    const response = await fetch(apiUrl + `/userConsole/${userConsole.id}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      alert("Console deleted successfully");
      setRefresh && setRefresh(true);
    } else {
      alert("There was an error deleting your console");
    }
  }

  function handleEditConsole() {
    navigate("/add-console", {
      state: { userConsole: userConsole }
    });
  }

  return (
    <div className={ gamer ? "own-card card" : "card" }>
      { gamer && <div className="buttons">
        <button type="button" className="delete" onClick={handleDeleteConsole}>X</button>
        <button type="button" className="edit" onClick={handleEditConsole}>✏</button>
      </div> }
      <div className="console-name">{userConsole?.name}</div>
      <div className="console-handheld">{userConsole?.is_handheld ? "Handheld Console" : "Home Console"}</div>
      <div className="console-maker">By {userConsole?.maker}</div>
      <div className="console-owned">{userConsole?.is_owned ? "Owned" : "Wanted"}</div>
      <div className="console-favorite favorite">{userConsole?.is_favorite ? "One of My Favorites" : ""}</div>
    </div>
  )
}