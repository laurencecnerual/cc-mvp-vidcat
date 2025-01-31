import { useState } from 'react'
import './App.css'
import Login from "./components/Login.tsx"
import Signup from "./components/Signup.tsx"
import MainPage from "./components/MainPage.tsx"

function App() {
  const [screen, setScreen] = useState("LOGIN")
  const [gamer, setGamer] = useState<Gamer | null>(null)

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
