const apiUrl: string = import.meta.env.VITE_API_URL;

type SignupProps = {
  setScreen: Function
}

export default function Signup({setScreen}: SignupProps) {
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
      //const payload = await response.json();
      setScreen("LOGIN");
    } else {
      alert("There was an error signing up")
    }
  }

  return (
    <>
      <h2>New Account</h2>
      <form action="" onSubmit={(event) => {
        event.preventDefault(); 
        let form = document.querySelector("form"); 
        handleSignup(
          (form?.querySelector("input.username") as HTMLInputElement).value, 
          (form?.querySelector("input.password") as HTMLInputElement).value, 
          (form?.querySelector("input.firstname") as HTMLInputElement).value, 
          (form?.querySelector("input.lastname") as HTMLInputElement).value
        )
      }}>
        <div id="firstname">
          <label htmlFor="firstname">First Name</label>
          <input type="text" className="firstname" id="firstname" name="firstname" placeholder="Patrick" required/>
        </div>
        <div id="lastname">
          <label htmlFor="lastname">Last Name</label>
          <input type="text" className="lastname" id="lastname" name="lastname" placeholder="Star" required/>
        </div>
        <div id="username">
          <label htmlFor="username">Username</label>
          <input type="text" className="username" id="username" name="username" placeholder="pstar777" required/>
        </div>
        <div id="password">
          <label htmlFor="password">Password</label>
          <input type="password" className="password" id="password" name="password" placeholder="m4k3175tr0ng!!" required/>
       </div>
       <button className="signup" type="submit">Sign Up</button>
      </form>
      <div onClick={() => {setScreen("LOGIN")}}><a href="#">Back to Login</a></div>
    </>
  );
}