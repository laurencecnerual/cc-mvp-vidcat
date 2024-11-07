import Header from "./Header"
import CoreContent from "./CoreContent";
import Footer from "./Footer";
import { Gamer } from "./App";
import { useState } from "react";

type MainPageProps = {
  setScreen: Function,
  gamer: Gamer | null
}

export default function MainPage({setScreen, gamer}: MainPageProps) {
  const [action, setAction] = useState("PROFILE");

  return (
    <>
      <Header setScreen={setScreen} setAction={setAction}/>
      <CoreContent gamer={gamer} action={action} setAction={setAction}/>
      <Footer />
    </>
  );
}