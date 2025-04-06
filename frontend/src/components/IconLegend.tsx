import { useState } from 'react';

type IconLegendProps = {
  isGameLegend: boolean
}

export default function IconLegend({isGameLegend}: IconLegendProps) {
  const [filterOwned, setFilterOwned] = useState(false);
  const [filterWanted, setFilterWanted] = useState(false);
  const [filterLoved, setFilterLoved] = useState(false);
  const [filterBeaten, setFilterBeaten] = useState(false);
  const [filterWIP, setFilterWIP] = useState(false);

  function handleToggle(state: boolean, setState: Function) {
    setState(!state);
  }

  function getLegendIconClassName(state: boolean): string {
    return state ? "legend-icon active-icon" : "legend-icon";
  }

  return (
    <>
      <div className="legend-container">
        <div className="legend">
          <div className={getLegendIconClassName(filterOwned)} onClick={() => handleToggle(filterOwned, setFilterOwned)}><span className="emoji">💸</span> Own it</div>
          <div className={getLegendIconClassName(filterWanted)} onClick={() => handleToggle(filterWanted, setFilterWanted)}><span className="emoji">🙏</span> Want it</div>
          <div className={getLegendIconClassName(filterLoved)} onClick={() => handleToggle(filterLoved, setFilterLoved)}><span className="emoji">❤️</span> Love it</div>
          { isGameLegend && <div className={getLegendIconClassName(filterBeaten)} onClick={() => handleToggle(filterBeaten, setFilterBeaten)}><span className="emoji">💯</span> Beat it</div> }
          { isGameLegend && <div className={getLegendIconClassName(filterWIP)} onClick={() => handleToggle(filterWIP, setFilterWIP)}><span className="emoji">⏳</span> WIP</div> }
        </div>
      </div>
    </>
  )
}