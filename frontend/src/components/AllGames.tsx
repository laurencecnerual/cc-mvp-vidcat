import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { showToast } from "../ToastHelper";
import Loading from "./Loading";
import GenericGameCard from "./GenericGameCard";

const apiUrl: string = import.meta.env.VITE_API_URL;

export default function AllGames() {
  const navigate = useNavigate();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  let currentPage = parseInt(searchParams.get("page") || "1");
  const [totalPages, setTotalPages] = useState(1);
  const [totalGames, setTotalGames] = useState(0);
  const [gameRangeStart, setGameRangeStart] = useState(0);
  const [gameRangeEnd, setGameRangeEnd] = useState(0);

  useEffect(() => {
    const pageParam = searchParams.get("page");
    const pageNumber = parseInt(pageParam || "", 10);

    if (isNaN(pageNumber) || pageNumber < 1) {
      currentPage = 1;
      setSearchParams({ page: "1" });
    } 

    handleFetchGames();
  }, [searchParams]);

  useEffect(() => {
  if (!searchParams.get("page")) {
    setSearchParams({ page: "1" });
  }
}, []);

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
    setSearchParams({ page: newPage.toString() });
    setLoading(true);
  }

  function goToPreviousPage(increment: number) {
    let newPage = currentPage - increment
    if (newPage < 1) newPage += totalPages;
    setSearchParams({ page: newPage.toString() });
    setLoading(true);
  }

  function generatePageChangeButtons() {
    return <div className="page-change-buttons">
        <div className="page-change-buttons-left">
          <button type="button" onClick={() => goToPreviousPage(100)}>{"<<<"}</button>
          <button type="button" onClick={() => goToPreviousPage(10)}>{"<<"}</button>
          <button type="button" onClick={() => goToPreviousPage(1)}>{"<"}</button>
        </div>
        <div className="page-change-buttons-right">
          <button type="button" onClick={() => goToNextPage(1)}>{">"}</button>
          <button type="button" onClick={() => goToNextPage(10)}>{">>"}</button>
          <button type="button" onClick={() => goToNextPage(100)}>{">>>"}</button>
        </div>
      </div>
  }

  if (loading) {
    return <Loading />
  }

  return (
    <>
      {
        games.length > 0 ?
        <div className="all-games">
          <Link to="/" onClick={(e) => { e.preventDefault(); navigate(-1); }} className="back">Back</Link>
          <h1>{`All Games (${totalGames.toLocaleString()} total!)`}</h1>
          <h2>{`Page ${currentPage} of ${totalPages}`}</h2>
          <h3>{`Games ${gameRangeStart.toLocaleString()} ~ ${gameRangeEnd.toLocaleString()}`}</h3>
          {generatePageChangeButtons()}
          <div className="games-list card-list">
            { games.map(game => <GenericGameCard game={game} key={game.rawg_id} />) }
          </div>
          {generatePageChangeButtons()}
        </div>
        : <p className="out-of-bounds">Looks like you went too high. <Link to={"/all-games?page=" + totalPages}>Try going here  instead.</Link></p>
      }
    </>
  )
}