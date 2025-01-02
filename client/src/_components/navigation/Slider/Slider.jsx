/* eslint-disable react/prop-types */
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import SliderItem from "./SliderItem";
import LeftArrow from '@/assets/images/left_arrow.png';
import RightArrow from '@/assets/images/right_arrow.png';


const LeftArr = (props) => {
  const { className, onClick } = props;
  return (
      <div className={className} onClick={onClick} >
          <img src={LeftArrow} alt="" />
      </div>
  );
}

const RightArr = (props) => {
  const { className, onClick } = props;

  return (
      <div className={className} onClick={onClick}>
          <img src={RightArrow} alt="" />
      </div>
  );
}

const MusicSlider = ({
  musicList,
  settings = {
    className: "slider",
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    nextArrow: <RightArr />,
    prevArrow: <LeftArr />,
    autoplay: true,
    variableWidth: true,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 3,
          infinite: true
        }
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow:3,
          slidesToScroll: 2,
          infinite: true
        }
      }
    ]
  }
}) => {
  return (
    <div className="relative overflow-hidden w-full mt-2">
      {musicList.length > 0 && (
        <Slider {...settings} className="slider">
          {musicList.map((playlist) => (
            <SliderItem key={playlist.id} playlist={playlist} />
          ))}
        </Slider>
      )}
    </div>
  );
};

export default MusicSlider;
