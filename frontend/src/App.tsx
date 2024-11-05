import { useState, useEffect } from 'react'
import './App.css'
import Login from "./Login.tsx"
import Signup from "./Signup.tsx"
import MainPage from "./MainPage.tsx"

function App() {
  const [screen, setScreen] = useState("LOGIN")

  useEffect(() => {
    //TBD
  }, []);

  return (
    <>
      { 
        screen === "LOGIN"? <Login setScreen={setScreen} />
        : screen === "SIGNUP"? <Signup setScreen={setScreen} />
        : <MainPage setScreen={setScreen} />
      }
    </>
  )
}

export default App
