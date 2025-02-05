const apiUrl: string = import.meta.env.VITE_API_URL;
import { useNavigate, Link, useLocation } from "react-router-dom";
import { showToast } from "../ToastHelper";

export default function EditConsole() {
  const navigate = useNavigate();
  const location = useLocation();
  const userConsole = location.state.userConsole;

  async function handleUpdateConsole(isOwned: boolean, isFavorite: boolean) {
    const response = await fetch(apiUrl + `/userconsole/${userConsole.id}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({isOwned: isOwned, isFavorite: isFavorite})
    });

    if (response.status === 200) {
      showToast("success", "Console updated successfully");
      navigate("/");
    } else {
      showToast("error", "There was an error updating your console");
    }
  }

  return (
    <>
      <Link to="/" className="back-to-profile">Back to Profile</Link>
      <form className="edit-console" action="" onSubmit={(event) => {
        event.preventDefault(); 
        let form = document.querySelector("form"); 
        handleUpdateConsole
        (
          (form?.querySelector("input.is-owned") as HTMLInputElement)?.checked,
          (form?.querySelector("input.is-favorite") as HTMLInputElement)?.checked
        )
      }}>
        <h2>{"Edit " + userConsole.name}</h2>
        <img className="edit-view console-picture" src={userConsole.picture} alt={"Photo of the console " + userConsole.name} />
        <div id="is-owned" className="label-input-pair">
          <label htmlFor="is-owned">I own it</label>
          { userConsole.is_owned ? <input type="checkbox" className="is-owned" id="is-owned" name="is-owned" defaultChecked/> : <input type="checkbox" className="is-owned" id="is-owned" name="is-owned"/> }
        </div>
        <div id="is-favorite" className="label-input-pair">
          <label htmlFor="is-favorite">It's a favorite of mine</label>
          { userConsole.is_favorite ? <input type="checkbox" className="is-favorite" id="is-favorite" name="is-favorite" defaultChecked/> : <input type="checkbox" className="is-favorite" id="is-favorite" name="is-favorite"/> }
        </div>
        <button className="update-console form" type="submit">Update Console</button>
      </form>
    </>
  );
}