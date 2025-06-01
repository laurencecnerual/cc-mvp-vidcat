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

  return (
    <>
      <p className="stats">
        <div>{gameCount === 1 ? "1 Game" : `${gameCount} Games`}</div>
        <div>{followerCount === 1 ? "1 Follower" : `${followerCount} Followers`}</div>
        <div>{`${followingCount} Following`}</div>
      </p>
    </>
  )
}