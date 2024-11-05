type LoginProps = {
  setScreen: Function
}

export default function Login({setScreen}: LoginProps) {
  return (
    <>
      <div>This is the login page</div>
      <div onClick={() => {setScreen("SIGNUP")}}>To Signup</div>
    </>
  );
}