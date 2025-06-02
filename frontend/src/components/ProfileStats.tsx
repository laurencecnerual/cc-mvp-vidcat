import { useGamer } from '../GamerContext.tsx';

type ProfileStatsProps = {
  profileID: number,
  gameCount: number
  followerCount: number, 
  followingCount: number
}

export default function ProfileStats({ profileID, gameCount, followerCount, followingCount }: ProfileStatsProps) {
  const {gamer} = useGamer(); // The viewing user
  const isActingUserStats = gamer?.id === profileID;
  if (isActingUserStats) isActingUserStats; // placeholder to prevent TS error on deploy

  return (
    <>
      <p className="stats">
        <span>{gameCount === 1 ? "1 Game" : `${gameCount} Games`}</span>
        <span>{followerCount === 1 ? "1 Follower" : `${followerCount} Followers`}</span>
        <span>{`${followingCount} Following`}</span>
      </p>
    </>
  )
}