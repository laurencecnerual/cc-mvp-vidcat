import { Gamer } from "./App";

type NewConsoleProps = {
  gamer: Gamer | null,
}

export default function NewConsole({gamer}: NewConsoleProps) {


  return (
    <>
      <div>{gamer?.username}'s New Console Page</div>
    </>
  );
}