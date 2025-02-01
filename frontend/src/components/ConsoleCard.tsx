import { useGamer } from "../GamerContext.tsx";
const apiUrl: string = import.meta.env.VITE_API_URL;

type ConsoleCardProps = {
  userConsole: UserConsoleWithConsoleData
}

export default function ConsoleCard ({userConsole}: ConsoleCardProps) {
  const {gamer} = useGamer();

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
      alert("Console deleted successfully")
    } else {
      alert("There was an error deleting your console");
    }
  }

  return (
    <div className="console-card card">
      { gamer && <button type="button" className="delete" onClick={handleDeleteConsole}>X</button> } 
      <div className="console-name">{userConsole?.name}</div>
      <div className="console-handheld">{userConsole?.is_handheld ? "Handheld Console" : "Home Console"}</div>
      <div className="console-maker">By {userConsole?.maker}</div>
      <div className="console-owned">{userConsole?.is_owned ? "Owned" : "Wanted"}</div>
      <div className="console-favorite favorite">{userConsole?.is_favorite ? "One of My Favorites" : ""}</div>
    </div>
  )
}