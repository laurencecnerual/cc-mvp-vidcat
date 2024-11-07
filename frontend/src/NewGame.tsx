import { useEffect, useState } from "react";
import { Gamer } from "./App";
const apiUrl: string = import.meta.env.VITE_API_URL;

type NewGameProps = {
  gamer: Gamer | null,
  setAction: Function
}

export default function NewGame({gamer, setAction}: NewGameProps) {


  return (
    <>
      <div>{gamer?.username}'s New Game Page</div>
    </>
  );
}