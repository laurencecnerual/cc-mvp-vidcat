const apiUrl: string = import.meta.env.VITE_API_URL;
import { useGamer } from "../GamerContext.tsx";

type LoginProps = {
  setScreen: Function
}

export default function Login({setScreen}: LoginProps) {
  const {setGamer} = useGamer();

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
      const payload = await response.json();

      if (payload.authenticationSuccessful) {
        setGamer(payload.gamer);
        setScreen("MAIN");
      } else {
        alert("There was an error authenticating");
      }
    } else {
      alert("There was an error logging in");
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
          <input type="text" className="username" id="username" name="username" placeholder="username" required/>
        </div>
        <div id="password" className="label-input-pair">
          <label htmlFor="password">Password</label>
          <input type="password" className="password" id="password" name="password" placeholder="password" required/>
       </div>
        <button className="login" type="submit">Log In</button>
        <div onClick={() => {setScreen("SIGNUP")}}><a href="#">Don't have an account yet?</a></div>
      </form>
    </>
  );
}