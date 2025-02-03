import { Link } from "react-router-dom";
import { useGamer } from "../GamerContext.tsx";

export default function ManageAccount() {
  const {gamer} = useGamer();

  function handleAccountUpdate(firstname: string, lastname: string, profilePicture: string) {
    console.log("handleAccountUpdate", firstname, lastname, profilePicture)
  }

  function handleChangeUsername(newUsername: string, password: string) {
    console.log("handleChangeUsername", newUsername, password)
  }

  function handleChangePassword(oldPassword: string, newPassword: string, confirmNewPassword: string) {
    console.log("handleChangePassword", oldPassword, newPassword, confirmNewPassword)
  }

  return (
    <>
      <Link to="/" className="back-to-profile">Back to Profile</Link>
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
          <input type="text" className="profile-picture" id="profile-picture" name="profile-picture" placeholder="./images/my_pic.jpg" defaultValue={gamer?.profile_picture}/>
        </div>
        <button className="update-account" type="submit">Update Account</button>
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
          <input type="text" className="username" id="username" name="username" placeholder="theNewPstar777" required/>
        </div>
        <div id="password" className="label-input-pair">
          <label htmlFor="password">Password</label>
          <input type="password" className="password" id="password" name="password" placeholder="m4k3175tr0ng!!" required/>
        </div>
        <button className="update-username" type="submit">Update Username</button>
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
            <label htmlFor="confirm-password">Confirm New Password</label>
            <input type="password" className="confirm-password" id="confirm-password" name="confirm-password" placeholder="m4k3175tr0ng2!!" required/>
        </div>
        <button className="update-password" type="submit">Update Password</button>
      </form>
    </>
  )
}