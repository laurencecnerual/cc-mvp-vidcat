type SignupProps = {
  setScreen: Function
}

export default function Signup({setScreen}: SignupProps) {
  return (
    <>
      <div>This is the signup page</div>
      <div onClick={() => {setScreen("LOGIN")}}>Back to Login</div>
    </>
  );
}