import { createContext, useContext, useState, useEffect } from 'react';
import { showToast } from "./ToastHelper.ts";
const apiUrl: string = import.meta.env.VITE_API_URL;

export const GamerContext = createContext<{
  gamer: Gamer | null;
  setGamer: React.Dispatch<React.SetStateAction<Gamer | null>>;
  handleLogout: () => void;
}>({
  gamer: null,
  setGamer: () => {},
  handleLogout: () => {}
});

export const useGamer = () => useContext(GamerContext);

export const GamerProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [gamer, setGamer] = useState<Gamer | null>(null);

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
    } else {
      showToast("error", "There was an error logging out");
    }
  }

  useEffect(() => {
    const savedGamer = localStorage.getItem('gamer');
    
    if (savedGamer) {
      setGamer(JSON.parse(savedGamer));
    }
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
    <GamerContext.Provider value={{ gamer, setGamer, handleLogout }}>
      {children}
    </GamerContext.Provider>
  );
};