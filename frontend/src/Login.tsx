type LoginProps = {
  setScreen: Function
}

export default function Login({setScreen}: LoginProps) {
  return (
    <>
      <h2>Existing Account</h2>
      <form action="">
        <div id="name">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username" placeholder="username" required/>
        </div>
        <div id="password">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" placeholder="password" required/>
       </div>
        <button className="login" type="button" onClick={() => {setScreen("MAIN")}}>Log In</button>
      </form>
      <div onClick={() => {setScreen("SIGNUP")}}><a href="#">To Signup</a></div>
    </>
  );
}