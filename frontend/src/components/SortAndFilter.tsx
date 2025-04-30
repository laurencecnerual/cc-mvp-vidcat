import { useState, useEffect } from 'react';

type SortAndFilterProps = {
  masterItems: UserConsoleWithConsoleData[] | UserGameWithGameData[],
  setMasterItems: Function, 
  setDisplayedItems: Function
}

export default function SortAndFilter({ masterItems, setMasterItems, setDisplayedItems }: SortAndFilterProps) {
  const [filterOwned, setFilterOwned] = useState(false);
  const [filterWanted, setFilterWanted] = useState(false);
  const [filterLoved, setFilterLoved] = useState(false);
  const [filterBeaten, setFilterBeaten] = useState(false);
  const [filterWIP, setFilterWIP] = useState(false);
  const itemsAreGames = masterItems.length > 0 ? "rawg_id" in masterItems[0] : false
  const [sortOrder, setSortOrder] = useState("add-date-old-first");

  useEffect(() => {
    setMasterItems(handleMasterSort());
  }, [sortOrder]);

  useEffect(() => {
    setDisplayedItems(handleDisplayFilter());
  }, [filterOwned, filterWanted, filterLoved, filterBeaten, filterWIP, masterItems])

  function handleMasterSort(): UserConsoleWithConsoleData[] | UserGameWithGameData[] {
    switch(sortOrder) {
      case 'add-date-old-first':
        if (itemsAreGames) {
          return (masterItems as UserGameWithGameData[]).slice().sort((gameA, gameB) => gameA.rawg_id - gameB.rawg_id);
        } else {
          return (masterItems as UserConsoleWithConsoleData[]).slice().sort((consoleA, consoleB) => consoleA.id - consoleB.id);
        }
      case 'add-date-new-first':
        if (itemsAreGames) {
          return (masterItems as UserGameWithGameData[]).slice().sort((gameA, gameB) => gameB.rawg_id - gameA.rawg_id);
        } else {
          return (masterItems as UserConsoleWithConsoleData[]).slice().sort((consoleA, consoleB) => consoleB.id - consoleA.id);
        }
      case 'name-abc-first':
        return masterItems.slice().sort((itemA, itemB) => (itemA.name).localeCompare(itemB.name));
      case 'name-zyx-first':
        return masterItems.slice().sort((itemA, itemB) => (itemB.name).localeCompare(itemA.name));
      case 'release-date-old-first':
        if (itemsAreGames) {
          return (masterItems as UserGameWithGameData[]).slice().sort((gameA, gameB) => new Date(gameA.released).getTime() - new Date(gameB.released).getTime());
        } else {
          return (masterItems as UserConsoleWithConsoleData[]).slice().sort((consoleA, consoleB) => consoleA.release_year - consoleB.release_year);
        }
      case 'release-date-new-first':
        if (itemsAreGames) {
          return (masterItems as UserGameWithGameData[]).slice().sort((gameA, gameB) => new Date(gameB.released).getTime() - new Date(gameA.released).getTime());
        } else {
          return (masterItems as UserConsoleWithConsoleData[]).slice().sort((consoleA, consoleB) => consoleB.release_year - consoleA.release_year);
        }
      case 'rawg-ranking-low-first':
        return (masterItems as UserGameWithGameData[]).slice().sort((gameA, gameB) => gameA.rating - gameB.rating);
      case 'rawg-ranking-high-first':
        return (masterItems as UserGameWithGameData[]).slice().sort((gameA, gameB) => gameB.rating - gameA.rating);
      default:
        return masterItems;
    }
  }

  function handleDisplayFilter(): UserConsoleWithConsoleData[] | UserGameWithGameData[] {
    let itemsToDisplay = masterItems as UserConsoleWithConsoleData[] | UserGameWithGameData[];

    if (filterOwned) {
      itemsToDisplay = itemsToDisplay.filter((item) => item.is_owned) as UserConsoleWithConsoleData[] | UserGameWithGameData[];
    } 
    
    if (filterWanted) {
      itemsToDisplay = itemsToDisplay.filter((item) => !item.is_owned) as UserConsoleWithConsoleData[] | UserGameWithGameData[];
    } 
    
    if (filterLoved) {
      itemsToDisplay = itemsToDisplay.filter((item) => item.is_favorite) as UserConsoleWithConsoleData[] | UserGameWithGameData[];
    }
    
    if (filterBeaten) {
      itemsToDisplay = itemsToDisplay.filter((item) => 'is_completed' in item && item.is_completed) as UserGameWithGameData[];
    } 
    
    if (filterWIP) {
      itemsToDisplay = itemsToDisplay.filter((item) => 'is_completed' in item && !item.is_completed) as UserGameWithGameData[];
    } 

    return itemsToDisplay;
  }

  function handleToggle(state: boolean, setState: Function): void {
    setState(!state);
  }

  function getLegendIconClassName(state: boolean): string {
    return state ? "legend-icon active-icon" : "legend-icon";
  }

  function handleSortOrderUpdate(event: React.ChangeEvent<HTMLSelectElement>): void {
    setSortOrder(event.target.value);
  }

  return (
    <>
      <div className="filter-sort-container">
        <div className="filter-legend">
          <div className={getLegendIconClassName(filterOwned)} onClick={() => handleToggle(filterOwned, setFilterOwned)}><span className="emoji">💸</span> Own it</div>
          <div className={getLegendIconClassName(filterWanted)} onClick={() => handleToggle(filterWanted, setFilterWanted)}><span className="emoji">🙏</span> Want it</div>
          <div className={getLegendIconClassName(filterLoved)} onClick={() => handleToggle(filterLoved, setFilterLoved)}><span className="emoji">❤️</span> Love it</div>
          { itemsAreGames && <div className={getLegendIconClassName(filterBeaten)} onClick={() => handleToggle(filterBeaten, setFilterBeaten)}><span className="emoji">💯</span> Beat it</div> }
          { itemsAreGames && <div className={getLegendIconClassName(filterWIP)} onClick={() => handleToggle(filterWIP, setFilterWIP)}><span className="emoji">⏳</span> WIP</div> }
        </div>
        <select className="sort-dropdown" name="sort-order" onChange={handleSortOrderUpdate}>
          <option value="add-date-old-first" >Date Added: Old to New</option>
          <option value="add-date-new-first">Date Added: New to Old</option>
          <option value="name-abc-first">Name: A to Z</option>
          <option value="name-zyx-first">Name: Z to A</option>
          <option value="release-date-old-first">Release Date: Old to New</option>
          <option value="release-date-new-first">Release Date: New to Old</option>
          { itemsAreGames && <option value="rawg-ranking-low-first">Official Score: Low to High</option> }
          { itemsAreGames && <option value="rawg-ranking-high-first">Official Score: High to Low</option> }
        </select>
      </div>
    </>
  )
}