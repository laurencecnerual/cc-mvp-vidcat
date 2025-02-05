const apiUrl: string = import.meta.env.VITE_API_URL;
import { useGamer } from "../GamerContext.tsx";
import { Link, useNavigate } from "react-router-dom";
import { showToast } from "../ToastHelper.ts";

export default function Login() {
  const {setGamer} = useGamer();
  const navigate = useNavigate();

  async function handleLogin(username: string, password: string) {
    const response = await fetch(apiUrl + "/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({username: username, password: password})
    });

    if (response.status === 200) {
      const loggedInGamer = await response.json();
      setGamer(loggedInGamer);
      navigate("/");
    } else if (response.status === 401 || response.status === 404) {
      showToast("error", "Incorrect password or username");
    } else {
      showToast("error", "There was an error logging in");
    }
  }

  return (
    <>
      <form className="login" action="" onSubmit={(event) => {
        event.preventDefault(); 
        let form = document.querySelector("form"); 
        handleLogin(
          (form?.querySelector("input.username") as HTMLInputElement).value, 
          (form?.querySelector("input.password") as HTMLInputElement).value
        )
      }}>
        <h2>Existing Account</h2>
        <div id="username" className="label-input-pair">
          <label htmlFor="username">Username</label>
          <input type="text" className="username" id="username" name="username" required/>
        </div>
        <div id="password" className="label-input-pair">
          <label htmlFor="password">Password</label>
          <input type="password" className="password" id="password" name="password" required/>
       </div>
        <button className="login form" type="submit">Log In</button>
        <Link to="/signup" className="intro-nav">Don't have an account yet?</Link>
      </form>
    </>
  );
}