import Header from "./Header"
import CoreContent from "./CoreContent";
import Footer from "./Footer";
import { useState } from "react";

export default function MainPage() {
  const [action, setAction] = useState("PROFILE");

  return (
    <div className="top-mid-bot">
      <Header setAction={setAction}/>
      <CoreContent action={action} setAction={setAction}/>
      <Footer />
    </div>
  );
}