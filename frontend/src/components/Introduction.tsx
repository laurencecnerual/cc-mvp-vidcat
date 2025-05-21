import { Link } from "react-router-dom";

export default function Intrduction() {
  return (
    <div className="intro">
      <h1 className="intro-header">Welcome to VidCat!</h1>
      <p className="intro-text">A place to keep track of the games and consoles you own and want!</p>
      <p className="intro-text">Need a little convincing? <Link to="/all-games" className="all-games-invitation">Check out our games!</Link></p>
    </div>
  )
}