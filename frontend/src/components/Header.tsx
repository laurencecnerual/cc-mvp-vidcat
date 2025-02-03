const apiUrl: string = import.meta.env.VITE_API_URL;
import { useGamer } from "../GamerContext.tsx";
import { useNavigate, Link, NavLink } from "react-router-dom";

export default function Header() {
  const {gamer, setGamer} = useGamer();
  const navigate = useNavigate();

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
      navigate("/login");
    } else {
      alert("There was an error logging out")
    }
  }

  return (
    <>
      { gamer ? 
      <div className="banner">
        <div className="logo"><Link to="/">VidCat</Link></div>
        <div className="menu-options">
          <div className="user-profile"><NavLink to="/" className={({ isActive }) => isActive ? "active-link" : ""}>My Profile</NavLink></div>
          <div className="add-console"><NavLink to="/add-console" className={({ isActive }) => isActive ? "active-link" : ""}>Add Console</NavLink></div>
          <div className="add-game"><NavLink to="/add-game" className={({ isActive }) => isActive ? "active-link" : ""}>Add Game</NavLink></div>
          <div className="manage-account"><NavLink to="/manage-account" className={({ isActive }) => isActive ? "active-link" : ""}>Manage Account</NavLink></div>
          <div className="logout" onClick={() => handleLogout()}><a href="#">Logout</a></div>
        </div>
      </div> 
      :
      <div className="banner">
        <div className="logo"><Link to="/login">VidCat</Link></div>
        <div className="menu-options">
          <div className="log-in"><NavLink to="/login" className={({ isActive }) => isActive ? "active-link" : ""}>Log In</NavLink></div>
          <div className="sign-up"><NavLink to="/signup" className={({ isActive }) => isActive ? "active-link" : ""}>Sign Up</NavLink></div>
        </div>
      </div> 
      }
    </>
  );
}