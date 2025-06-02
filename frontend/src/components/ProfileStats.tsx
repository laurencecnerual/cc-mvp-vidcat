import { useGamer } from '../GamerContext.tsx';
import { Link } from "react-router-dom";

type ProfileStatsProps = {
  profileID: number,
  gameCount: number
  followerCount: number, 
  followingCount: number
}

export default function ProfileStats({ profileID, gameCount, followerCount, followingCount }: ProfileStatsProps) {
  const {gamer} = useGamer(); // The viewing user
  const isActingUserStats = gamer?.id === profileID;
  const gameText = gameCount === 1 ? "1 Game" : `${gameCount} Games`;
  const followerText = followerCount === 1 ? "1 Follower" : `${followerCount} Followers`;
  const followingText = `${followingCount} Following`;

  return (
    <>
      <p className="stats">
        <span>{gameText}</span>
        { (isActingUserStats && followerCount > 0) ? <Link to="#">{followerText}</Link> : <span>{followerText}</span> } 
        { (isActingUserStats && followingCount > 0) ? <Link to="#">{followingText}</Link> : <span>{followingText}</span> } 
      </p>
    </>
  )
}