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

  if (loading) {
    return <Loading />
  }

  return (
    <>
      <div className="followerPage">
        <Link to="/" onClick={(e) => { e.preventDefault(); navigate(-1); }} className="back">Back</Link>
        <h1 className="follower-list">{isFollowerList ? "Your Followers" : "Currently Following"}</h1>
        <div className="partner-list">
          {followPartners.map(partner => <p key={partner.id}>{"・"+ partner.username}</p>)}
        </div>
      </div>
    </>
  )
}