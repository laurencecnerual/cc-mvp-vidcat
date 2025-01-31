import { useGamer } from "../GamerContext.tsx";

export default function Footer({}) {
  const {gamer} = useGamer();

  return (
    <>
      {gamer && <div className="disclaimer">All game data and images on this site were sourced from <a href="https://rawg.io/apidocs" target="_blank" rel="noopener noreferrer">RAWG</a></div>}
    </>
  );
}