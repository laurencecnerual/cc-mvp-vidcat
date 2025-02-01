import { useGamer } from "../GamerContext.tsx";

type GameCardProps = {
  userGame: UserGameWithGameData
}

export default function GameCard ({userGame}: GameCardProps) {
  const {gamer} = useGamer();

  return (
    <div className="game-card card">
      { gamer && <button type="button" className="delete">X</button> } 
      <div className="game-name">{userGame?.name}</div>
      <img className="game-picture" src={userGame?.background_image_link} alt={"Photo of the game " + userGame?.name} />
      <div className="game-owned">{userGame?.is_owned ? "Owned" : "Wanted"}</div>
      <div className="game-handheld">{userGame?.is_completed ? "Beaten" : "Not Yet Finished"}</div>
      <div className="game-favorite favorite">{userGame?.is_favorite ? "One of My Favorites" : ""}</div>
      <div className="game-official-rating">Official Rating: {userGame?.rating}</div>
      <div className="game-personal-rating">{userGame?.personal_rating ? "My score: " + userGame?.personal_rating: ""}</div>
      <div className="game-personal-review">{userGame?.personal_review ? "My review: " + userGame?.personal_review : ""}</div>
    </div>
  )
}