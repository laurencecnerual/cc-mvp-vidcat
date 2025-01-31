import Header from "./Header"
import CoreContent from "./CoreContent";
import Footer from "./Footer";
import { useState } from "react";

type MainPageProps = {
  setScreen: Function,
}

export default function MainPage({setScreen}: MainPageProps) {
  const [action, setAction] = useState("PROFILE");

  return (
    <div className="top-mid-bot">
      <Header setScreen={setScreen} setAction={setAction}/>
      <CoreContent action={action} setAction={setAction}/>
      <Footer />
    </div>
  );
}