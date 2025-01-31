import NewConsole from "./NewConsole";
import NewGame from "./NewGame";
import Profile from "./Profile";

type CoreContentProps = {
  gamer: Gamer | null,
  action: string,
  setAction: Function
}

export default function CoreContent({gamer, action, setAction}: CoreContentProps) {


  return (
    <>
      { 
        action === "NEWCONSOLE"? <NewConsole gamer={gamer} setAction={setAction}/>
        : action === "NEWGAME"? <NewGame gamer={gamer} setAction={setAction}/>
        : <Profile gamer={gamer}/>
      }
    </>
  );
}