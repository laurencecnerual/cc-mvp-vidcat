import { Request, Response } from "express";
import { addFollowPair, deleteFollowPair, getAllUsersFollowingTheGamer, getAllUsersTheGamerIsFollowing, getCountOfUsersFollowingTheGamer, getCountOfUsersTheGamerIsFollowing, getSpecificFollowPair } from "./follower.model";
import { getGamerByID } from "../gamer/gamer.model";

export const getFollowPairsByType = async (req: Request, res: Response) => {
  const gamerID = parseInt(req.params.id);
  let type = (req.query.type as string || "").toLowerCase();

  if (!['followers', 'following'].includes(type)) {
    return res.status(400).send("Invalid Type ('followers' or 'following' expected)");
  }

  try {
    let followPairs: FollowPair[] = [];

    if (type === "followers") {
      followPairs = await getAllUsersFollowingTheGamer(gamerID)
    } else if (type === "following") {
      followPairs = await getAllUsersTheGamerIsFollowing(gamerID)
    }

    res.status(200).json(followPairs);
  } catch (err) {
    res.status(500).send(err);
  }
};

type FollowerStats = {
  follower_count: number, 
  following_count: number
}

export const getFollowerStats = async (gamerID: number):  Promise<FollowerStats> => {
  const followerCount = await getCountOfUsersFollowingTheGamer(gamerID);
  const followingCount = await getCountOfUsersTheGamerIsFollowing(gamerID);

  return {
    follower_count: followerCount, 
    following_count: followingCount
  } as FollowerStats;
};

export const createFollowPair = async (req: Request, res: Response) => {
  const followerID = parseInt(req.params.follower_id);
  const followeeID = req.body.followee_id;

  if (!followeeID) {
    return res.status(400).send("Followee ID is required");
  }

  if (followerID === followeeID) {
    return res.status(400).send("Cannot Follow Self");
  }

  const existingUser = await getGamerByID(followeeID);

  if (!existingUser) {
    return res.status(404).send("Followee Does Not Exist");
  }

  const followPair: FollowPair = {
    follower_id: followerID,
    followee_id: followeeID
  }

  const existingPairs = await getSpecificFollowPair(followPair);

  if (existingPairs.length > 0) {
    return res.status(403).send("Gamer Already a Follower");
  }

  try {
    const newlyAdded = await addFollowPair(followPair);
    res.status(201).json(newlyAdded[0]);
  } catch (err) {
    res.status(500).send(err);
  }
};

export const removeFollowPair = async (req: Request, res: Response) => {
  const followerID = parseInt(req.params.follower_id);
  const followeeID = parseInt(req.params.followee_id);

  const followPair: FollowPair = {
    follower_id: followerID,
    followee_id: followeeID
  }

  try {
    const deletedFollowPairs = await deleteFollowPair(followPair);

    if (!deletedFollowPairs[0]) {
      return res.status(400).send("Gamer Already Not a Follower");
    }

    res.status(200).send(deletedFollowPairs[0]);
  } catch (err) {
    res.status(500).send(err);
  }
}