import { useState } from 'react';
import './App.css'
import Login from "./components/Login.tsx"
import Signup from "./components/Signup.tsx"
import MainPage from "./components/MainPage.tsx"
import { GamerContext } from "./GamerContext.tsx"

function App() {
  const [screen, setScreen] = useState("LOGIN")
  const [gamer, setGamer] = useState<Gamer | null>(null);

  return (
    <GamerContext.Provider value={{ gamer, setGamer }}>
      { 
        screen === "LOGIN"? <Login setScreen={setScreen} />
        : screen === "SIGNUP"? <Signup setScreen={setScreen} />
        : <MainPage setScreen={setScreen} />
      }
    </GamerContext.Provider>
  )
}

export default App
