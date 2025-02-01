import { useGamer } from "../GamerContext.tsx";

type ConsoleCardProps = {
  userConsole: UserConsoleWithConsoleData
}

export default function ConsoleCard ({userConsole}: ConsoleCardProps) {
  const {gamer} = useGamer();

  return (
    <div className="console-card card">
      { gamer && <button type="button" className="delete">X</button> } 
      <div className="console-name">{userConsole?.name}</div>
      <div className="console-handheld">{userConsole?.is_handheld ? "Handheld Console" : "Home Console"}</div>
      <div className="console-maker">By {userConsole?.maker}</div>
      <div className="console-owned">{userConsole?.is_owned ? "Owned" : "Wanted"}</div>
      <div className="console-favorite favorite">{userConsole?.is_favorite ? "One of My Favorites" : ""}</div>
    </div>
  )
}