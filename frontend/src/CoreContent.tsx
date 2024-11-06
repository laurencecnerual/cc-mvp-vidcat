import { Gamer } from "./App";

type CoreContentProps = {
  gamer: Gamer | null
}

export default function CoreContent({gamer}: CoreContentProps) {


  return (
    <>
      <div>{gamer?.username}'s Games Galore</div>
    </>
  );
}