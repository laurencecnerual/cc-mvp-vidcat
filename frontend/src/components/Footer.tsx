import { useGamer } from "../GamerContext.tsx";
import { useLocation } from 'react-router-dom';

export default function Footer() {
  const {gamer} = useGamer();
  const currentPage = useLocation().pathname.slice(1);
  const nonUserPages = ["login", "signup", "add-console", "add-game", "not-found"];

  return (
    <>
      {(gamer || !nonUserPages.includes(currentPage)) && <div className="disclaimer">All game data and images on this site were sourced from <a href="https://rawg.io/apidocs" target="_blank" rel="noopener noreferrer">RAWG</a></div>}
    </>
  );
}