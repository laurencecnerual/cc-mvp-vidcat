import { useState } from 'react';
import './App.css'
import Login from "./components/Login.tsx"
import Signup from "./components/Signup.tsx"
import Profile from './components/Profile.tsx';
import NewConsole from './components/NewConsole.tsx';
import NewGame from './components/NewGame.tsx';
import Header from './components/Header.tsx';
import Footer from './components/Footer.tsx';
import { GamerContext } from "./GamerContext.tsx"
import {Routes, Route, Navigate} from "react-router-dom";

function App() {
  const [gamer, setGamer] = useState<Gamer | null>(null);

  return (
    <GamerContext.Provider value={{ gamer, setGamer }}>
      <div className="top-mid-bot">
        <Header />
        <Routes>
          <Route path="/" element={gamer ? <Profile /> : <Navigate to="/login" />} />
          <Route path="login" element={!gamer ? <Login /> : <Navigate to="/" />} /> 
          <Route path="signup" element={!gamer ? <Signup /> : <Navigate to="/" />}  />
          <Route path="add-console" element={gamer ? <NewConsole /> : <Navigate to="/login" />} />
          <Route path="add-game" element={gamer ? <NewGame /> : <Navigate to="/login" />} />
          <Route path="*" element={<h1 className="public-profile">Public User Profile or User Not Found Message Goes Here</h1>} />
        </Routes>
        <Footer />
      </div>
    </GamerContext.Provider>
  )
}

export default App
