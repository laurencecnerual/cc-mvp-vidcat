import { useState, useEffect } from 'react';
import { useGamer } from '../GamerContext.tsx';
import { Link, useNavigate } from "react-router-dom";
import Loading from "./Loading.tsx";
import { showToast } from '../ToastHelper.ts';

const apiUrl: string = import.meta.env.VITE_API_URL;

type FollowerManagementProps = {
  isFollowerList: boolean
}

export default function FollowerManagement({ isFollowerList }: FollowerManagementProps) {
  const navigate = useNavigate();
  const {gamer} = useGamer();
  const [loading, setLoading] = useState(true);
  const [followPartners, setFollowPartners] = useState<FollowPairData[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  useEffect(() => {
    handleFetchFollowerDetails();
  }, [loading])

  async function handleFetchFollowerDetails() {
    const response = await fetch(apiUrl + `/gamer/${gamer?.id}/follower?type=${isFollowerList ? "followers" : "following"}`, {
      method: 'GET',
      credentials: 'include'
    });

    if (response.status === 200) {
      const partners = await response.json();
      setFollowPartners(partners);
    } else if (response.status !== 404) {
      showToast("error", `There was an error loading your ${isFollowerList ? "follower" : "following"} list`);
    }

    setLoading(false);
  }

  function generatePartnerCard(partner: FollowPairData) {
    return (
      <div className="follower-card" key={partner.id} onClick={() => navigate(`/users/${partner.username}`)}>
        <img className="follower-picture" src={partner.profile_picture || "/no-profile-picture.png"} alt={`Picture of ${partner.username}`} loading="lazy" onLoad={handleImageLoad} onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.onerror = null;
          target.src = "/no-profile-picture.png";
        }}           
        style={{
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 1s ease-in-out',
          }} />
        <p className="follower-name">{partner.username}</p>
      </div>
    )
  }

  if (loading) {
    return <Loading />
  }

  return (
    <>
      <div className="follower-page">
        <Link to="/" onClick={(e) => { e.preventDefault(); navigate(-1); }} className="back">Back</Link>
        <h1>{isFollowerList ? "Your Followers" : "Currently Following"}</h1>
        <div className="follower-list">
          {followPartners.map(partner => generatePartnerCard(partner))}
        </div>
      </div>
    </>
  )
}