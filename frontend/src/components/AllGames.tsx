import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { showToast } from "../ToastHelper";
import Loading from "./Loading";
import Icon from "@mdi/react";
import { mdiMagnify } from '@mdi/js';

const apiUrl: string = import.meta.env.VITE_API_URL;

export default function AllGames() {
  const navigate = useNavigate();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalGames, setTotalGames] = useState(0);
  const [gameRangeStart, setGameRangeStart] = useState(0);
  const [gameRangeEnd, setGameRangeEnd] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  function handleViewGame(game: Game) {
    navigate("/view-game", {
      state: { userGame: game }
    });
  }

  useEffect(() => {
    handleFetchGames();
  }, [currentPage]);

  async function handleFetchGames() {
    const response = await fetch(apiUrl + `/game?page=${currentPage}`);

    if (response.status === 200) {
      const payload = await response.json();
      setGames(payload.games);
      setTotalGames(payload.totalGames);
      setTotalPages(payload.totalPages);
      setGameRangeStart(payload.gameRangeStart);
      setGameRangeEnd(payload.gameRangeEnd);
    } else {
      showToast("error", "There was an error loading the games");
    }

    setLoading(false);
  }

  function goToNextPage(increment: number) {
    let newPage = currentPage + increment
    if (newPage > totalPages) newPage -= totalPages;
    setCurrentPage(newPage)
    setLoading(true);
    setIsLoaded(false);
  }

  function goToPreviousPage(increment: number) {
    let newPage = currentPage - increment
    if (newPage < 1) newPage += totalPages;
    setCurrentPage(newPage)
    setLoading(true);
    setIsLoaded(false);
  }

  function generateGameGridAndCards() {
      return <div className="games-list card-list">
        { games.map(game => <div className="card generic-card" key={game.rawg_id}>
          <div className="game-name">{game.name}</div>
                <div className="game-picture-container">
                  <img className="game-picture" src={game.background_image_link} alt={"Photo of the game " + game.name} onClick={() => handleViewGame(game)} onLoad={handleImageLoad}
                      style={{
                        opacity: isLoaded ? 1 : 0,
                        transition: 'opacity 1s ease-in-out',
                      }}
                  />
                  <div className="top-right-icon" onClick={() => handleViewGame(game)}><Icon path={mdiMagnify} size={0.9} /></div>
                </div>
        </div>) }
      </div>
  }

  function generatePageChangeButtons() {
    return <div className="page-change-buttons">
        <button type="button" onClick={() => goToPreviousPage(100)}>{"<<<"}</button>
        <button type="button" onClick={() => goToPreviousPage(10)}>{"<<"}</button>
        <button type="button" onClick={() => goToPreviousPage(1)}>{"<"}</button>
        <button type="button" onClick={() => goToNextPage(1)}>{">"}</button>
        <button type="button" onClick={() => goToNextPage(10)}>{">>"}</button>
        <button type="button" onClick={() => goToNextPage(100)}>{">>>"}</button>
      </div>
  }

  if (loading) {
    return <Loading />
  }

  return (
    <div className="all-games">
      <Link to="/" onClick={(e) => { e.preventDefault(); navigate(-1); }} className="back">Back</Link>
      <h1>{`All Games (${totalGames.toLocaleString()} total!)`}</h1>
      <h2>{`Page ${currentPage} of ${totalPages}`}</h2>
      <h3>{`Games ${gameRangeStart.toLocaleString()} ~ ${gameRangeEnd.toLocaleString()}`}</h3>
      {generatePageChangeButtons()}
      {generateGameGridAndCards()}
      {generatePageChangeButtons()}
    </div>
  )

}