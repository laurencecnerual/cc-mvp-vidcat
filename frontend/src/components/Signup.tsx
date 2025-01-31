const apiUrl: string = import.meta.env.VITE_API_URL;
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  async function handleSignup(username: string, password: string, firstname: string, lastname: string) {
    const response = await fetch(apiUrl + "/signup", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({username: username, password: password, firstname: firstname, lastname: lastname})
    });

    if (response.status === 201) {
      navigate("login");
    } else {
      alert("There was an error signing up")
    }
  }

  return (
    <>
      <form className="signup" action="" onSubmit={(event) => {
        event.preventDefault(); 
        let form = document.querySelector("form"); 
        handleSignup(
          (form?.querySelector("input.username") as HTMLInputElement).value, 
          (form?.querySelector("input.password") as HTMLInputElement).value, 
          (form?.querySelector("input.firstname") as HTMLInputElement).value, 
          (form?.querySelector("input.lastname") as HTMLInputElement).value
        )
      }}>
        <h2>New Account</h2>
        <div id="firstname" className="label-input-pair">
          <label htmlFor="firstname">First Name</label>
          <input type="text" className="firstname" id="firstname" name="firstname" placeholder="Patrick" required/>
        </div>
        <div id="lastname" className="label-input-pair">
          <label htmlFor="lastname">Last Name</label>
          <input type="text" className="lastname" id="lastname" name="lastname" placeholder="Star" required/>
        </div>
        <div id="username" className="label-input-pair">
          <label htmlFor="username">Username</label>
          <input type="text" className="username" id="username" name="username" placeholder="pstar777" required/>
        </div>
        <div id="password" className="label-input-pair">
          <label htmlFor="password">Password</label>
          <input type="password" className="password" id="password" name="password" placeholder="m4k3175tr0ng!!" required/>
       </div>
       <button className="signup" type="submit">Sign Up</button>
       <Link to="/login">Already have an account?</Link>
      </form>
    </>
  );
}