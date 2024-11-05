type SignupProps = {
  setScreen: Function
}

export default function Signup({setScreen}: SignupProps) {
  return (
    <>
      <h2>New Account</h2>
      <form action="">
        <div id="firstname">
          <label htmlFor="firstname">First Name</label>
          <input type="text" id="firstname" name="firstname" placeholder="Patrick" required/>
        </div>
        <div id="lastname">
          <label htmlFor="lastname">Last Name</label>
          <input type="text" id="lastname" name="lastname" placeholder="Star" required/>
        </div>
        <div id="username">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username" placeholder="pstar777" required/>
        </div>
        <div id="password">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" placeholder="m4k3175tr0ng!!" required/>
       </div>
       <button className="signup" type="button" onClick={() => {setScreen("LOGIN")}}>Sign Up</button>
      </form>
      <div onClick={() => {setScreen("LOGIN")}}><a href="#">Back to Login</a></div>
    </>
  );
}