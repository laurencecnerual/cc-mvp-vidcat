import { Link, useNavigate } from "react-router-dom";
import { useGamer } from "../GamerContext.tsx";
import { showToast } from "../ToastHelper.ts";
import { useState } from "react";

const apiUrl: string = import.meta.env.VITE_API_URL;

export default function ManageAccount() {
  const {gamer, setGamer} = useGamer();
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };
  
  async function handleAccountUpdate(firstname: string, lastname: string, profilePicture: string) {
    const response = await fetch(apiUrl + `/gamer/${gamer?.id}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({firstname: firstname, lastname: lastname, profilePicture: profilePicture})
    });

    if (response.status === 200) {
      const updatedGamer = await response.json();
      setGamer(updatedGamer);
      showToast("success", "Account info updated successfully");
      navigate("/");
    } else {
      showToast("error", "There was an error updating your account info");
    }
  }

  async function handleChangeUsername(newUsername: string, password: string) {
    const response = await fetch(apiUrl + `/gamer/${gamer?.id}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({newUsername: newUsername, password: password})
    });

    if (response.status === 200) {
      const updatedGamer = await response.json();
      setGamer(updatedGamer);
      showToast("success", "Username changed successfully");
      navigate("/");
    } else if (response.status === 401) {
      showToast("error", "Incorrect password");
    } else if (response.status === 403) {
      showToast("warn", "That username has already been taken");
    } else {
      showToast("error", "There was an error changing your username");
    }
  }

  async function handleChangePassword(oldPassword: string, newPassword: string, confirmNewPassword: string) {
    if (newPassword !== confirmNewPassword) {
      showToast("warn", "Passwords must match");
      return;
    }

    const response = await fetch(apiUrl + `/gamer/${gamer?.id}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({password: oldPassword, newPassword: newPassword})
    });

    if (response.status === 200) {
      const updatedGamer = await response.json();
      setGamer(updatedGamer);
      showToast("success", "Password changed successfully");
      navigate("/");
    } else if (response.status === 401) {
      showToast("error", "Incorrect password");
    } else {
      showToast("error", "There was an error changing your password");
    }
  }

  return (
    <div className="manage-account-page">
      <Link to="/" className="back-to-profile">Back to Profile</Link>
      <h1>{gamer?.username}'s Account</h1>
      <img src={gamer?.profile_picture ? gamer.profile_picture : "/no-profile-picture.png"} className="account-profile-picture" alt={gamer?.username + "'s profile picture"} onLoad={handleImageLoad}
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 1s ease-in-out',
          }} />
      <form className="edit-account-info manage-account" action="" onSubmit={(event) => {
        event.preventDefault(); 
        let accountInfoForm = document.querySelector("form.edit-account-info"); 
        handleAccountUpdate(
          (accountInfoForm?.querySelector("input.firstname") as HTMLInputElement).value, 
          (accountInfoForm?.querySelector("input.lastname") as HTMLInputElement).value,
          (accountInfoForm?.querySelector("input.profile-picture") as HTMLInputElement).value
        )
      }}>
        <h2>Edit Account Info</h2>
        <div id="firstname" className="label-input-pair">
          <label htmlFor="firstname">First Name</label>
          <input type="text" className="firstname" id="firstname" name="firstname" placeholder="Patrick" defaultValue={gamer?.firstname}/>
        </div>
        <div id="lastname" className="label-input-pair">
          <label htmlFor="lastname">Last Name</label>
          <input type="text" className="lastname" id="lastname" name="lastname" placeholder="Star" defaultValue={gamer?.lastname}/>
        </div>
        <div id="profile-picture" className="label-input-pair">
          <label htmlFor="profile-picture">Profile Picture URL</label>
          <input type="text" className="profile-picture" id="profile-picture" name="profile-picture" placeholder="www.example.com/my_pic.jpg" defaultValue={gamer?.profile_picture}/>
        </div>
        <button className="update-account form" type="submit">Update Account</button>
      </form>
      <form className="change-username manage-account" action="" onSubmit={(event) => {
        event.preventDefault(); 
        let usernameForm = document.querySelector("form.change-username"); 
        handleChangeUsername(
          (usernameForm?.querySelector("input.username") as HTMLInputElement).value, 
          (usernameForm?.querySelector("input.password") as HTMLInputElement).value
        )
      }}>
        <h2>Change Username</h2>
        <div id="username" className="label-input-pair">
          <label htmlFor="username">New Username</label>
          <input type="text" className="username" id="username" name="username" placeholder="theNewPstar777" required pattern="[a-zA-Z0-9]+" title="Only letters and numbers are allowed."/>
        </div>
        <div id="password" className="label-input-pair">
          <label htmlFor="password">Password</label>
          <input type="password" className="password" id="password" name="password" placeholder="m4k3175tr0ng!!" required/>
        </div>
        <button className="update-username form" type="submit">Update Username</button>
      </form>
      <form className="change-password manage-account" action="" onSubmit={(event) => {
        event.preventDefault(); 
        let passwordForm = document.querySelector("form.change-password"); 
        handleChangePassword(
          (passwordForm?.querySelector("input.old-password") as HTMLInputElement).value, 
          (passwordForm?.querySelector("input.new-password") as HTMLInputElement).value, 
          (passwordForm?.querySelector("input.confirm-password") as HTMLInputElement).value
        )
      }}>
        <h2>Change Password</h2>
        <div id="old-password" className="label-input-pair">
          <label htmlFor="old-password">Current Password</label>
          <input type="password" className="old-password" id="old-password" name="old-password" placeholder="m4k3175tr0ng!!" required/>
        </div>
        <div id="new-password" className="label-input-pair">
            <label htmlFor="new-password">New Password</label>
            <input type="password" className="new-password" id="new-password" name="new-password" placeholder="m4k3175tr0ng2!!" required/>
        </div>
        <div id="confirm-password" className="label-input-pair">
            <label htmlFor="confirm-password">Confirm Password</label>
            <input type="password" className="confirm-password" id="confirm-password" name="confirm-password" placeholder="m4k3175tr0ng2!!" required/>
        </div>
        <button className="update-password form" type="submit">Update Password</button>
      </form>
    </div>
  )
}