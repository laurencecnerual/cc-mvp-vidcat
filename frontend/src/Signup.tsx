type SignupProps = {
  setScreen: Function
}

export default function Signup({setScreen}: SignupProps) {
  return (
    <>
      <div>This is the signup page</div>
      <button className="signup" type="button" onClick={() => {setScreen("LOGIN")}}>Sign Up</button>
      <div onClick={() => {setScreen("LOGIN")}}>Back to Login</div>
    </>
  );
}