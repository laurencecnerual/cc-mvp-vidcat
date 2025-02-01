import { useLocation } from 'react-router-dom';

export default function PublicProfile({}) {
  const username = useLocation().pathname.slice(1);

  return (
    <>
      {<h1 className="public-profile">{`${username}'s Public Profile`}</h1>}
    </>
  );
}