import { createContext, useContext, useState, useEffect } from 'react';
import { showToast } from "./ToastHelper.ts";
const apiUrl: string = import.meta.env.VITE_API_URL;

export const GamerContext = createContext<{
  gamer: Gamer | null;
  setGamer: React.Dispatch<React.SetStateAction<Gamer | null>>;
  handleLogout: () => void;
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  gamer: null,
  setGamer: () => {},
  handleLogout: () => {},
  isLoggedIn: false,
  setIsLoggedIn: () => {}
});

export const useGamer = () => useContext(GamerContext);

export const GamerProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [gamer, setGamer] = useState<Gamer | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  async function handleLogout() {
    const response = await fetch(apiUrl + "/logout", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      }
    });

    if (response.status === 200) {
      setGamer(null);
      setIsLoggedIn(false);
    } else {
      showToast("error", "There was an error logging out");
    }
  }

  // checks if still logged into the backend and if not, forces a full logout
  async function handleCheckLoggedIn() {
    const response = await fetch(apiUrl + "/session", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      }
    });

    if (response.status === 401) {
      handleLogout();
    } else if (response.status === 200) {
      setIsLoggedIn(true);
    }
  }

  useEffect(() => {
    const savedGamer = localStorage.getItem('gamer');
    
    if (savedGamer) {
      setGamer(JSON.parse(savedGamer));
    }

    handleCheckLoggedIn();
  }, []);

  useEffect(() => {
    if (gamer) {
      localStorage.setItem('gamer', JSON.stringify(gamer));
    } else {
      localStorage.removeItem('gamer');
      localStorage.removeItem('gameList');
    }
  }, [gamer]);

  return (
    <GamerContext.Provider value={{ gamer, setGamer, handleLogout, isLoggedIn, setIsLoggedIn }}>
      {children}
    </GamerContext.Provider>
  );
};