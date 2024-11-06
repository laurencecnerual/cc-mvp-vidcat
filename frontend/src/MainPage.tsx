import Header from "./Header"
import CoreContent from "./CoreContent";
import Footer from "./Footer";
import { Gamer } from "./App";

type MainPageProps = {
  setScreen: Function,
  gamer: Gamer | null
}

export default function MainPage({setScreen, gamer}: MainPageProps) {
  return (
    <>
      <Header setScreen={setScreen}/>
      <CoreContent gamer={gamer}/>
      <Footer />
    </>
  );
}