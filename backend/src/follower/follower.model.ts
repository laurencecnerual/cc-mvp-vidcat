const knex = require("../knex");
const FOLLOWER_TABLE = "follower";

export const getAllUsersFollowingTheGamer = (gamerID: number): Promise<FollowPair[]> => {
  return knex
  .select("*")
  .from(FOLLOWER_TABLE)
  .where({followee_id: gamerID});
};

export const getAllUsersTheGamerIsFollowing = (gamerID: number): Promise<FollowPair[]> => {
  return knex
  .select("*")
  .from(FOLLOWER_TABLE)
  .where({follower_id: gamerID});
};

export const getCountOfUsersFollowingTheGamer = async (gamerID: number): Promise<number> => {
  const result = await knex(FOLLOWER_TABLE)
  .where({followee_id: gamerID})
  .count('followee_id as count');

  return Number(result[0].count);
};

export const getCountOfUsersTheGamerIsFollowing = async (gamerID: number): Promise<number> => {
  const result = await knex(FOLLOWER_TABLE)
  .where({follower_id: gamerID})
  .count('follower_id as count');
  
  return Number(result[0].count);
};

export const getSpecificFollowPair = (followPair: FollowPair): Promise<FollowPair[]> => {
  return knex
  .select("*")
  .from(FOLLOWER_TABLE)
  .where(followPair);
};

export const addFollowPair = (followPair: FollowPair): Promise<FollowPair> => {
  return knex
  .returning("*")
  .insert(followPair)
  .into(FOLLOWER_TABLE);
};

export const deleteFollowPair = (followPair: FollowPair): Promise<FollowPair> => {
  return knex(FOLLOWER_TABLE)
  .returning("*")
  .where({ 
    follower_id: followPair.follower_id, 
    followee_id: followPair.followee_id
  })
  .del();
};