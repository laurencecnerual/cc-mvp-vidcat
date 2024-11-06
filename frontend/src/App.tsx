import { useState, useEffect } from 'react'
import './App.css'
import Login from "./Login.tsx"
import Signup from "./Signup.tsx"
import MainPage from "./MainPage.tsx"

export type Gamer = {
  id: number,
  username: string,
  firstname: string,
  lastname: string
  profile_picture: BinaryData,
  account_created: Date,
  last_login: Date
}

function App() {
  const [screen, setScreen] = useState("LOGIN")
  const [gamer, setGamer] = useState<Gamer | null>(null)

  useEffect(() => {
    //TBD
  }, []);

  return (
    <>
      { 
        screen === "LOGIN"? <Login setScreen={setScreen} setGamer={setGamer}/>
        : screen === "SIGNUP"? <Signup setScreen={setScreen} />
        : <MainPage setScreen={setScreen} gamer={gamer}/>
      }
    </>
  )
}

export default App
