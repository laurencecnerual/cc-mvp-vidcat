import { Gamer } from "./App";

type ProfileProps = {
  gamer: Gamer | null,
}

export default function Profile({gamer}: ProfileProps) {


  return (
    <>
      <h1>{gamer?.username}'s Profile</h1>
      <div className="consoles-section">
        <h2>Consoles</h2>
      </div>
      <div className="games-section">
        <h2>Games</h2>
      </div>
    </>
  );
}