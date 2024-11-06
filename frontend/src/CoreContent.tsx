import { Gamer } from "./App";
import NewConsole from "./NewConsole";
import NewGame from "./NewGame";
import Profile from "./Profile";

type CoreContentProps = {
  gamer: Gamer | null,
  action: string
}

export default function CoreContent({gamer, action}: CoreContentProps) {


  return (
    <>
      <div>{gamer?.username}'s Games Galore</div>
      { 
        action === "NEWCONSOLE"? <NewConsole />
        : action === "NEWGAME"? <NewGame />
        : <Profile />
      }
    </>
  );
}