import { Gamer } from "./App";

type ProfileProps = {
  gamer: Gamer | null,
}

export default function Profile({gamer}: ProfileProps) {


  return (
    <>
      <div>{gamer?.username}'s Profile Page</div>
    </>
  );
}