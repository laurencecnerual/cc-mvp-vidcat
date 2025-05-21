import { useNavigate, Link, useLocation } from "react-router-dom";
import { showToast } from "../ToastHelper";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

const apiUrl: string = import.meta.env.VITE_API_URL;

export default function ViewGame() {
  const navigate = useNavigate();
  const location = useLocation();
  const userGame = location.state.userGame;
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    handleFetchScreenshots();
  }, [loading])

  async function handleFetchScreenshots() {
    const response = await fetch(apiUrl + `/game/${userGame.rawg_id}/screenshot`);

    if (response.status === 200) {
      const screenshotURLs = await response.json();
      setScreenshots([userGame.background_image_link].concat(screenshotURLs));
    } else if (response.status === 404) {
      showToast("error", "Game not found");
    } else {
      showToast("error", "There was an error loading screenshots for the game");
    }

    setLoading(false);
  }

  if (loading) return <Loading />;

  return (
    <div className="view-game-page">
      <Link to="/" onClick={(e) => { e.preventDefault(); navigate(-1); }} className="back-to-profile">Back to Profile</Link>
        <h2 className="screenshots-title">{`Enter ${userGame.name} (${userGame.released.slice(0,4)})`}</h2>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{
            delay: 8000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          loop
        >
        {screenshots.map((screenshotURL) => (
          <SwiperSlide key={screenshotURL.split("/").pop()}>
            <img className="game-screenshot" src={screenshotURL} alt={`Screenshot at ${screenshotURL}`} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}