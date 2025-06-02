import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useParams } from 'react-router';
import ConsoleCard from './ConsoleCard';
import GameCard from './GameCard';
import Loading from "./Loading.tsx";
import { showToast } from '../ToastHelper.ts';
import SortAndFilter from './SortAndFilter.tsx';
import Icon from '@mdi/react';
import { mdiArrowCollapseAll, mdiArrowExpandAll } from '@mdi/js';
import { useGamer } from '../GamerContext.tsx';
import ProfileStats from './ProfileStats.tsx';

const apiUrl: string = import.meta.env.VITE_API_URL;

export default function PublicProfile() {
  const username = useParams().username || "";
  const [loading, setLoading] = useState(true);
  const [userConsoles, setUserConsoles] = useState<UserConsoleWithConsoleData[]>([]);
  const [displayedUserConsoles, setDisplayedUserConsoles] = useState<UserConsoleWithConsoleData[]>([]);
  const [userGames, setUserGames] = useState<UserGameWithGameData[]>([]);
  const [displayedUserGames, setDisplayedUserGames] = useState<UserGameWithGameData[]>([]);
  const [profilePicture, setProfilePicture] = useState<string>();
  const [profileID, setProfileID] = useState<number>(-1); // The user ID for this profile
  const [validatedUsername, setValidatedUsername] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [consoleSectionOpen, setConsoleSectionOpen] = useState(true);
  const [gameSectionOpen, setGameSectionOpen] = useState(true);
  const toggleButtonSize = 0.9;
  const [isFollowing, setIsFollowing] = useState(false); // Is the viewing user already following this profile
  const {gamer} = useGamer(); // The viewing user
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [imgSrc, setImgSrc] = useState(profilePicture || "/no-profile-picture.png");

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  useEffect(() => {
    handleFetchProfile();
  }, [loading])

  const handleBadImgSrc = () => {
    setImgSrc("/no-profile-picture.png");
  };

  async function handleFetchProfile() {
    const response = await fetch(apiUrl + `/profile/${username}`, {
      method: 'GET',
      credentials: 'include'
    });

    if (response.status === 200) {
      const collectionObject = await response.json();
      setUserConsoles(collectionObject.userconsoles);
      setUserGames(collectionObject.usergames);
      setProfilePicture(collectionObject.profilePicture);
      setProfileID(collectionObject.id);
      setFollowerCount(collectionObject.followerCount);
      setFollowingCount(collectionObject.followingCount);
      collectionObject.viewerIsFollower && setIsFollowing(true);
      setValidatedUsername(username);
    } else if (response.status !== 404) {
      showToast("error", "There was an error loading the user's profile");
    }

    setLoading(false);
  }

  function generateConsoleGridAndCards() {
    if (displayedUserConsoles.length > 0) {
      return <div className="consoles-list card-list">
        { displayedUserConsoles.map((userConsole) => <ConsoleCard key={userConsole.id} userConsole={userConsole} />) }
      </div>
    } else {
      return <p className="over-filtered">Oops, it looks like you've filtered too much. Try removing some criteria.</p>
    }
  }

  function generateGameGridAndCards() {
    if (displayedUserGames.length > 0) {
      return <div className="games-list card-list">
        { displayedUserGames.map((userGame) => <GameCard key={userGame.id} userGame={userGame} />) }
      </div>
    } else {
      return <p className="over-filtered">Oops, it looks like you've filtered too much. Try removing some criteria.</p>
    }
  }

  function toggleCollapseExpand(currentValue: boolean, setState: Function) {
    setState(!currentValue);
  }

  function handleGetAppropriateButton() {
    return isFollowing ?
      <button className="unfollow" type="button" onClick={handleUnfollow}>{"Unfollow " + validatedUsername}</button>
      : <button className="follow" type="button" onClick={handleFollow}>{"Follow " + validatedUsername}</button> 
  }

  async function handleFollow() {
    const response = await fetch(apiUrl + `/gamer/${gamer?.id}/follower`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ followee_id: profileID })
    });

    if (response.status === 201) {
      showToast("success", "Follow successful");
      setIsFollowing(true);
    } else {
      showToast("error", "Unable to follow");
    }
  }

  async function handleUnfollow() {
    const response = await fetch(apiUrl + `/gamer/${gamer?.id}/follower/${profileID}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      }
    });

    if (response.status === 200) {
      showToast("success", "Unfollow successful");
      setIsFollowing(false);
    } else {
      showToast("error", "Unable to unfollow");
    }
  }

  if (loading) {
    return <Loading />
  }

  return (
    <>
      { validatedUsername ?
        <div className="public-profile">
          <h1>{`${validatedUsername}'s Public Profile`}</h1>
          <img src={imgSrc} className="public-profile-picture" alt={validatedUsername + "'s profile picture"} onLoad={handleImageLoad} loading="lazy" onError={handleBadImgSrc}
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 1s ease-in-out',
          }} />
          <ProfileStats profileID={profileID} gameCount={userGames.length} followerCount={followerCount} followingCount={followingCount}/>
          { gamer && gamer.id !== profileID && handleGetAppropriateButton() }
          {
            consoleSectionOpen ?
            <h2 className="non-top-header">Consoles <button className="collapse-button" type="button" onClick={() => toggleCollapseExpand(consoleSectionOpen, setConsoleSectionOpen)}><Icon path={mdiArrowCollapseAll} size={toggleButtonSize} /></button></h2>
            : <h2 className="non-top-header">Consoles <button className="collapse-button" type="button" onClick={() => toggleCollapseExpand(consoleSectionOpen, setConsoleSectionOpen)}><Icon path={mdiArrowExpandAll} size={toggleButtonSize} /></button></h2>
          }
          { consoleSectionOpen && <div className="consoles-section">
            { (userConsoles.length > 0) && <SortAndFilter masterItems={userConsoles} setMasterItems={setUserConsoles} setDisplayedItems={setDisplayedUserConsoles} /> }
            { 
              userConsoles.length > 0 ? 
              generateConsoleGridAndCards() 
              : <p className="nothing-registered">No Consoles Registered</p>
            }
          </div> }
          {
            gameSectionOpen ?
            <h2 className="non-top-header">Games <button className="collapse-button" type="button" onClick={() => toggleCollapseExpand(gameSectionOpen, setGameSectionOpen)}><Icon path={mdiArrowCollapseAll} size={toggleButtonSize} /></button></h2>
            : <h2 className="non-top-header">Games <button className="collapse-button" type="button" onClick={() => toggleCollapseExpand(gameSectionOpen, setGameSectionOpen)}><Icon path={mdiArrowExpandAll} size={toggleButtonSize} /></button></h2>
          }
          { gameSectionOpen && <div className="games-section">
            { (userGames.length > 0) && <SortAndFilter masterItems={userGames} setMasterItems={setUserGames} setDisplayedItems={setDisplayedUserGames} /> }
            { 
              userGames.length > 0 ? 
              generateGameGridAndCards() 
              : <p className="nothing-registered">No Games Registered</p> 
            }
          </div> }
        </div>
        : <Navigate to="/not-found" />
      }
    </>
  );
}