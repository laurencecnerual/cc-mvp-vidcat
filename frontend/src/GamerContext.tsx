import { createContext, useContext, useState, useEffect } from 'react';

export const GamerContext = createContext<{
  gamer: Gamer | null;
  setGamer: React.Dispatch<React.SetStateAction<Gamer | null>>;
}>({
  gamer: null,
  setGamer: () => {},
});

export const useGamer = () => useContext(GamerContext);

export const GamerProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [gamer, setGamer] = useState<Gamer | null>(null);

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
    <GamerContext.Provider value={{ gamer, setGamer }}>
      {children}
    </GamerContext.Provider>
  );
};