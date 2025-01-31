import { useEffect, useState } from "react";
const apiUrl: string = import.meta.env.VITE_API_URL;

type NewConsoleProps = {
  gamer: Gamer | null,
  setAction: Function
}

export default function NewConsole({gamer, setAction}: NewConsoleProps) {

  const [consoleList, setConsoleList] = useState<GameConsole[]>([]);

  useEffect(() => {
    handleFetchConsoles();
  }, []);

  async function handleFetchConsoles() {
    const response = await fetch(apiUrl + "/console", {
      credentials: "include"
    });

    if (response.status === 200) {
      const consoleArray = await response.json();
      setConsoleList(consoleArray);
    } else {
      alert("There was an error loading the consoles list");
    }
  }

  async function handleAddConsole(gamerID: number | undefined, consoleName: string, isOwned: boolean, isFavorite: boolean) {
    const consoleID = (consoleList.find((console) => console.name === consoleName))?.id

    const response = await fetch(apiUrl + `/gamer/${gamerID}/userconsole`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({consoleID: consoleID, isOwned: isOwned, isFavorite: isFavorite})
    });

    if (response.status === 200) {
      const payload = await response.json();
      console.log("The following console has been added", payload);
      setAction("PROFILE");
    } else {
      alert("There was an error adding your console");
    }
  }

  return (
    <>
      <form className="new-console" action="" onSubmit={(event) => {
        event.preventDefault(); 
        let form = document.querySelector("form"); 
        handleAddConsole
        (
          gamer?.id,
          (form?.querySelector("input.console-name") as HTMLInputElement).value,
          (form?.querySelector("input.is-owned") as HTMLInputElement)?.checked,
          (form?.querySelector("input.is-favorite") as HTMLInputElement)?.checked
        )
      }}>
        <h2>New Console</h2>
        <div id="console-name" className="label-input-pair">
          <label htmlFor="console-name" >Name of Console</label>
          <input type="text" list="console-list" className="console-name" id="console-name" name="console-name" required/>
          <datalist id="console-list">
            {consoleList.map((console) => <option key={"" + console.id} id={"" + console.id} value={console.name}>{console.name}</option>)}
          </datalist>
        </div>
        <div id="is-owned" className="label-input-pair">
          <label htmlFor="is-owned">I own this console</label>
          <input type="checkbox" className="is-owned" id="is-owned" name="is-owned" defaultChecked/>
        </div>
        <div id="is-favorite" className="label-input-pair">
          <label htmlFor="is-favorite">This console is one of my favorites</label>
          <input type="checkbox" className="is-favorite" id="is-favorite" name="is-favorite"/>
        </div>
        <button className="login" type="submit">Add Console</button>
        <div onClick={() => {setAction("PROFILE")}}><a href="#">Back to Profile</a></div>
      </form>
    </>
  );
}