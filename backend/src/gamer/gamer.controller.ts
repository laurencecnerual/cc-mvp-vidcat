import { getGamerByUsername, addUser, updateLastLogin, updateGamerByID, getGamerByID } from './gamer.model';
import { getAllUserConsoles } from "../userconsole/userconsole.model";
import { getAllUserGames } from "../usergame/usergame.model";
import { Request, Response } from "express";
import { askChatGPT } from "../recommendationGenerator"
import { getSpecificFollowPair } from '../follower/follower.model';
import { getFollowerStats } from '../follower/follower.controller';
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

  if (!username || !password || !username.match(/^[a-z0-9]+$/i)) {
    return res.status(400).send("Both Username and Password are required and Username must be alphanumeric");
  }

  const userFound = await getGamerByUsername(username);

  if (userFound) {
    return res.status(403).send("User Already Exists");
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
        return res.status(403).send("User Already Exists");
      }

      payload.username = newUsername;
    } 
  } 
  
  // Handle account info update
  if (firstname || firstname === "") payload.firstname = firstname;
  if (lastname || lastname === "") payload.lastname = lastname;
  if (profilePicture || profilePicture === "") payload.profile_picture = profilePicture;

  try {
    const modifiedGamers = await updateGamerByID(gamerID, payload);

    if (!modifiedGamers[0]) {
      return res.status(404).send("The User Does Not Exist");
    }

    delete modifiedGamers[0].salted_hash;
    res.status(200).send(modifiedGamers[0]);
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

  req.session.gamer_id = user.id;
  const lastLoginUpdatedUsers = await updateLastLogin(user.id, new Date());
  delete lastLoginUpdatedUsers[0].salted_hash;

  if (!lastLoginUpdatedUsers[0]) {
    return res.status(500).send("Could Not Log In");
  }

  res.status(200).json(lastLoginUpdatedUsers[0]);
};

export const sendUserID = (req: Request, res: Response) => {
  res.status(200).json({ gamerID: req.session.gamer_id });
}

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
  const profileViewerID = req.session.gamer_id;
  const gamer = await getGamerByUsername(username);

  if (!gamer) {
    return res.status(404).send("User Not Found");
  }

  try {
    const allConsolesForUser = await getAllUserConsoles(gamer.id);
    const allGamesForUser = await getAllUserGames(gamer.id);
    const followerStats = await getFollowerStats(gamer.id)

    const payload = {
      userconsoles: allConsolesForUser,
      usergames: allGamesForUser,
      profilePicture: gamer.profile_picture,
      id: gamer.id,
      username: gamer.username,
      viewerIsFollower: false,
      followerCount: followerStats.follower_count,
      followingCount: followerStats.following_count
    }

    if (profileViewerID) {
      const followPair: FollowPair = {
        follower_id: profileViewerID,
        followee_id: gamer.id
      }

      const existingPairs = await getSpecificFollowPair(followPair);

      if (existingPairs.length > 0) {
        payload.viewerIsFollower = true;
      }
    }

    res.status(200).json(payload);
  } catch (err) {
    res.status(500).send(err);
  }
};

export const getGameRecommendationsForUser = async (req: Request, res: Response) => {
  if (!req.query.rawg_id) {
    return res.status(400).send("Game ID Required");
  }

  const userID = Number(req.session.gamer_id)
  const gameID = Number(req.query.rawg_id);
  const allGamesForUser = await getAllUserGames(userID);
  const allConsolesForUser = await getAllUserConsoles(userID);
  const gamesMatchingID = allGamesForUser.filter(game => game.rawg_id === gameID);

  if (!gamesMatchingID) {
    return res.status(400).send("Invalid Game ID Received");
  }

  const gameOfInterest = `'${gamesMatchingID[0].name}'`;
  const consoleCollection = "[CONSOLES I OWN]: " + allConsolesForUser.map(console => `${console.name}`).join(", ") +  ". ";
  const gameCollection = "[GAMES I OWN]: " + allGamesForUser.map(game => `'${game.name}'`).join(", ") +  ". ";

  const question = "Recommend me video games I do not yet own that exist on consoles I do own and are similar to " + gameOfInterest + ". " + consoleCollection + gameCollection;

  try {
    let answer = await askChatGPT(question);
    let trailingCommaIndex = answer.length - 3;

    if (answer[trailingCommaIndex] === ",") {
      answer = answer.slice(0, trailingCommaIndex) + answer.slice(trailingCommaIndex + 1);
    }

    return res.status(200).json(answer);
  } catch(err) {
    return res.status(500).send("Error Generating Recommendations")
  }
};