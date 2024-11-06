import Header from "./Header"
import CoreContent from "./CoreContent";
import Footer from "./Footer";

type MainPageProps = {
  setScreen: Function
}

export default function MainPage({setScreen}: MainPageProps) {
  return (
    <>
      <Header setScreen={setScreen}/>
      <CoreContent />
      <Footer />
    </>
  );
}