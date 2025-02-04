import { getGamerByUsername, addUser, updateLastLogin, updateGamerByID, getGamerByID } from './gamer.model';
import { getAllUserConsoles } from "../userconsole/userconsole.model";
import { getAllUserGames } from "../usergame/usergame.model";
import { Request, Response } from "express";
const bcrypt = require("bcrypt");

async function hashPassword(plainTextPassword: string) {
  const saltRounds = 10;
  try {
    const hash = await bcrypt.hash(plainTextPassword, saltRounds);
    return hash;
  } catch (err) {
    console.error("Hashing error:", err);
  }
}

async function verifyPassword(plainTextPassword: string, hashedPasswordFromDB: string) {
  try {
    const match = await bcrypt.compare(plainTextPassword, hashedPasswordFromDB);
    return match;
  } catch (err) {
    console.error("Verification error:", err);
  }
}

export const signup = async (req: Request, res: Response) => {
  const { username, password, firstname, lastname } = req.body;

  if (!username || !password) {
    return res.status(400).send("Both Username and Password are required");
  }

  const userFound = await getGamerByUsername(username);

  if (userFound) {
    return res.status(400).send("User Already Exists");
  }

  const saltedHash = await hashPassword(password);

  let newGamer = {
    username: username,
    salted_hash: saltedHash,
    firstname: firstname,
    lastname: lastname
  };

  const userCreated = await addUser(newGamer);
  delete userCreated[0].salted_hash;

  res.status(201).json(userCreated[0]);
};

export const updateGamer = async (req: Request, res: Response) => {
  const gamerID = parseInt(req.params.id);
  const { firstname, lastname, profilePicture, newUsername, password, newPassword } = req.body;
  console.log(newPassword)

  const gamer = await getGamerByID(gamerID);
  let payload: Partial<Gamer> = {};

  if (password) {
    const passwordsMatch = await verifyPassword(password, gamer.salted_hash);

    if (!passwordsMatch) {
      return res.status(401).send("Incorrect Password");
    }

    if (newPassword) { // Handle password change
      payload.salted_hash = await hashPassword(newPassword);
    }
    
    if (newUsername) { // Handle username change

      const newUserNameAlreadyInUse = await getGamerByUsername(newUsername);

      if (newUserNameAlreadyInUse) {
        return res.status(400).send("User Already Exists");
      }

      payload.username = newUsername;
    } 
  } 
  
  // Handle account info update
  if (firstname) payload.firstname = firstname;
  if (lastname) payload.lastname = lastname;
  if (profilePicture) payload.profile_picture = profilePicture;

  try {
    const modifiedGamer = await updateGamerByID(gamerID, payload);
    res.status(200).send(modifiedGamer);
  } catch (err) {
    res.status(500).send("Unable to Update User Account");
  }
}

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Both Username and Password are required");
  }

  const user = await getGamerByUsername(username);

  if (!user) {
    return res.status(404).send("User Not Found");
  }

  const saltedHash = user.salted_hash;
  const authenicationResult = await verifyPassword(password, saltedHash);

  if (!authenicationResult) {
    return res.status(401).send("Incorrect Password");
  }

  req.session.username = user.username;
  const lastLoginUpdatedUsers = await updateLastLogin(user.id, new Date());
  delete lastLoginUpdatedUsers[0].salted_hash;

  if (!lastLoginUpdatedUsers) {
    return res.status(500).send("Could Not Log In");
  }

  res.status(200).json(lastLoginUpdatedUsers[0]);
};

export const logout = (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Could Not Log Out");
    }
    res.clearCookie("connect.sid");
    res.status(200).send("Log Out Successful");
  });
};

//For public user profile (i.e. all userconsoles and usergames for the given gamer's username)
export const getGamerProfile = async (req: Request, res: Response) => {
  const username = req.params.username;
  const gamer = await getGamerByUsername(username);

  if (!gamer) {
    return res.status(404).send("User Not Found");
  }

  try {
    const allConsolesForUser = await getAllUserConsoles(gamer.id);
    const allGamesForUser = await getAllUserGames(gamer.id);
    res.status(200).json({
      userconsoles: allConsolesForUser,
      usergames: allGamesForUser
    });
  } catch (err) {
    res.status(500).send(err);
  }
};