import { createContext, useContext } from 'react';

export const GamerContext = createContext<{
  gamer: Gamer | null;
  setGamer: React.Dispatch<React.SetStateAction<Gamer | null>>;
}>({
  gamer: null,
  setGamer: () => {},
});

export const useGamer = () => useContext(GamerContext);