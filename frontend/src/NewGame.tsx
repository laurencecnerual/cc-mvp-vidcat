import { Gamer } from "./App";

type NewGameProps = {
  gamer: Gamer | null,
}

export default function NewGame({gamer}: NewGameProps) {


  return (
    <>
      <div>{gamer?.username}'s New Game Page</div>
    </>
  );
}