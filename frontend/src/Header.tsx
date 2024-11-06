const apiUrl: string = import.meta.env.VITE_API_URL;

type HeaderProps = {
  setScreen: Function
}

export default function Header({setScreen}: HeaderProps) {

  async function handleLogout() {
    const response = await fetch(apiUrl + "/logout", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      }
    });

    if (response.status === 200) {
      //const payload = await response.json();
      setScreen("LOGIN");
    } else {
      alert("There was an error logging out")
    }
  }

  return (
    <>
      <div className="banner">
        <div className="logo">VidCat</div>
        <div className="menu-options">
          <div className="user-profile"><a href="#">My Profile</a></div>
          <div className="add-console"><a href="#">Add Console</a></div>
          <div className="add-game"><a href="#">Add Game</a></div>
          <div className="logout" onClick={() => handleLogout()}><a href="#">Logout</a></div>
        </div>
      </div>
    </>
  );
}