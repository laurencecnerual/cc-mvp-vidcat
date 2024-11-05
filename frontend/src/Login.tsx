type LoginProps = {
  setScreen: Function
}

export default function Login({setScreen}: LoginProps) {
  return (
    <>
      <div>This is the login page</div>
      <button className="login" type="button" onClick={() => {setScreen("MAIN")}}>Log In</button>
      <div onClick={() => {setScreen("SIGNUP")}}>To Signup</div>
    </>
  );
}