import { getGamerByUsername, addUser, updateLastLogin } from './gamer.model'; 
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
    return res.status(401).json({ authenticationSuccessful: authenicationResult });
  }

  req.session.username = user.username;
  const lastLoginUpdateResult = await updateLastLogin(user.id, new Date());
  delete lastLoginUpdateResult[0].salted_hash;

  if (!lastLoginUpdateResult) {
    return res.status(500).send("Could Not Log In");
  }

  res.status(200).json({
    authenticationSuccessful: authenicationResult,
    gamer: lastLoginUpdateResult[0],
  });
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