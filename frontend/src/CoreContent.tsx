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
      { 
        action === "NEWCONSOLE"? <NewConsole gamer={gamer}/>
        : action === "NEWGAME"? <NewGame gamer={gamer}/>
        : <Profile gamer={gamer}/>
      }
    </>
  );
}