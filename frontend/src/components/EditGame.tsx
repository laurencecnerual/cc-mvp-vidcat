import { useNavigate, Link, useLocation } from "react-router-dom";
import { showToast } from "../ToastHelper";

const apiUrl: string = import.meta.env.VITE_API_URL;

export default function EditGame() {
  const navigate = useNavigate();
  const location = useLocation();
  const userGame = location.state.userGame;

  async function handleUpdateGame(isOwned: boolean, isCompleted: boolean, isFavorite: boolean, personalRating: number | null, personalReview: string) {
    if (personalRating === 0) personalRating = null;

    const response = await fetch(apiUrl + `/usergame/${userGame.id}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({isOwned: isOwned, isCompleted: isCompleted, isFavorite: isFavorite, personalRating: personalRating, personalReview: personalReview})
    });

    if (response.status === 200) {
      showToast("success", "Game updated successfully");
      navigate("/");
    } else {
      showToast("error", "There was an error updating your game");
    }
  }

  return (
    <>
      <Link to="/" className="back-to-profile">Back to Profile</Link>
      <form className="edit-game" action="" onSubmit={(event) => {
      event.preventDefault(); 
      let form = document.querySelector("form"); 
      handleUpdateGame
      (
        (form?.querySelector("input.is-owned") as HTMLInputElement)?.checked,
        (form?.querySelector("input.is-completed") as HTMLInputElement)?.checked,
        (form?.querySelector("input.is-favorite") as HTMLInputElement)?.checked,
        Number((form?.querySelector("input.personal-rating") as HTMLInputElement)?.value),
        (form?.querySelector("input.personal-review") as HTMLInputElement)?.value
      )
    }}>
        <h2>{"Edit " + userGame.name}</h2>
        <img className="edit-view" src={userGame?.background_image_link} alt={"Photo of the game " + userGame?.name} />
        <div id="is-owned" className="label-input-pair">
          <label htmlFor="is-owned">I own it</label>
          { userGame.is_owned ? <input type="checkbox" className="is-owned" id="is-owned" name="is-owned" defaultChecked/> : <input type="checkbox" className="is-owned" id="is-owned" name="is-owned"/> } 
        </div>
        <div id="is-completed" className="label-input-pair">
          <label htmlFor="is-completed">I beat it</label>
          { userGame.is_completed ? <input type="checkbox" className="is-completed" id="is-completed" name="is-completed" defaultChecked/> : <input type="checkbox" className="is-completed" id="is-completed" name="is-completed"/> }
        </div>
        <div id="is-favorite" className="label-input-pair">
          <label htmlFor="is-favorite">It's a favorite of mine</label>
          { userGame.is_favorite ? <input type="checkbox" className="is-favorite" id="is-favorite" name="is-favorite" defaultChecked/> : <input type="checkbox" className="is-favorite" id="is-favorite" name="is-favorite" /> }
        </div>
        <div id="personal-rating" className="label-input-pair">
          <label htmlFor="personal-rating">Rating</label>
          <input type="number" step="0.01" min="1.00" max="5.00" className="personal-rating" id="personal-rating" name="personal-rating" placeholder="1.00 ~ 5.00" defaultValue={userGame.personal_rating}/>
        </div>
        <div id="personal-review" className="label-input-pair">
          <label htmlFor="personal-review">Review</label>
          <textarea className="personal-review" id="personal-review" name="personal-review" placeholder="Write your review here" defaultValue={userGame.personal_review}/>
        </div>
        <button className="login" type="submit">Update Game</button>
      </form>
    </>
  );
}