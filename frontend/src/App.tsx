import { useContext } from 'react';
import './App.css'
import Login from "./components/Login.tsx"
import Signup from "./components/Signup.tsx"
import AllGames from './components/AllGames.tsx';
import Profile from './components/Profile.tsx';
import NewConsole from './components/NewConsole.tsx';
import NewGame from './components/NewGame.tsx';
import ManageAccount from './components/ManageAccount.tsx';
import EditConsole from './components/EditConsole.tsx';
import EditGame from './components/EditGame.tsx';
import ViewGame from './components/ViewGame.tsx';
import Header from './components/Header.tsx';
import Footer from './components/Footer.tsx';
import PublicProfile from './components/PublicProfile.tsx';
import NotFound from './components/NotFound.tsx';
import { GamerContext } from "./GamerContext.tsx"
import {Routes, Route, Navigate} from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';

Modal.setAppElement('#root');

function App() {
  const { gamer, isLoggedIn } = useContext(GamerContext);

  return (
      <div className="top-mid-bot">
        <Header />
        <Routes>
          <Route path="/" element={(isLoggedIn && gamer) ? <Profile /> : <Navigate to="/login" />} />
          <Route path="login" element={!gamer ? <Login /> : <Navigate to="/" />} /> 
          <Route path="signup" element={!gamer ? <Signup /> : <Navigate to="/" />}  />
          <Route path="all-games" element={<AllGames />} />
          <Route path="manage-account" element={gamer ? <ManageAccount /> : <Navigate to="/login" />} />
          <Route path="add-console" element={gamer ? <NewConsole /> : <Navigate to="/login" />} />
          <Route path="add-game" element={gamer ? <NewGame /> : <Navigate to="/login" />} />
          <Route path="edit-console" element={gamer ? <EditConsole /> : <Navigate to="/login" />} />
          <Route path="edit-game" element={gamer ? <EditGame /> : <Navigate to="/login" />} />
          <Route path="view-game" element={<ViewGame />} />
          <Route path="/users/:username" element={<PublicProfile />} />
          <Route path="*" element={<Navigate to="/not-found" />} />
          <Route path="not-found" element={<NotFound />} />
        </Routes>
        <Footer />
        <ToastContainer />
      </div>
  )
}

export default App
