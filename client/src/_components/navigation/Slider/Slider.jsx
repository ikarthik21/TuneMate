/* eslint-disable react/prop-types */
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import SliderItem from "./SliderItem";

const MusicSlider = ({
  musicList,
  settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 8,
    slidesToScroll: 4,
    autoplay: true
  }
}) => {
  return (
    <div className="relative overflow-hidden w-full">
      {musicList.length > 0 && (
        <Slider {...settings}>
          {musicList.map((playlist) => (
            <SliderItem key={playlist.id} playlist={playlist} />
          ))}
        </Slider>
      )}
    </div>
  );
};

export default MusicSlider;
