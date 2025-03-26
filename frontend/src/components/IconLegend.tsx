export default function IconLegend() {
  return (
    <>
      <div className="legend-container">
        <div className="legend">
          <div className="owned-icon"><span className="emoji">💸</span> Own it</div>
          <div className="wanted-icon"><span className="emoji">🙏</span> Want it</div>
          <div className="favorite-icon"><span className="emoji">❤️</span> Love it</div>
          <div className="completed-icon"><span className="emoji">💯</span> Beat it</div>
          <div className="in-progress-icon"><span className="emoji">⏳</span> WIP</div>
        </div>
      </div>
    </>
  )
}