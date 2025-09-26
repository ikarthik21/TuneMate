/* eslint-disable react/prop-types */
import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import SliderItem from "./SliderItem";
import LeftArrow from "@/assets/images/left_arrow.png";
import RightArrow from "@/assets/images/right_arrow.png";

const MusicSlider = ({
  musicList,
  title,
  settings = {
    className: "slider",
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    autoplay: false,
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
          slidesToShow: 3,
          slidesToScroll: 2,
          infinite: true
        }
      }
    ]
  }
}) => {
  // Create a ref for the slider
  const sliderRef = React.useRef(null);

  return (
    <div className="w-full mt-2">
      <div className="flex justify-between items-center ">
        <h1 className="text-2xl md:text-3xl jaro-head">{title}</h1>
        <div className="flex items-center space-x-3">
          <div
            className="cursor-pointer hover:opacity-75"
            onClick={() => sliderRef.current?.slickPrev()}
          >
            <img src={LeftArrow} alt="Previous" className="w-5 h-5" />
          </div>
          <div
            className="cursor-pointer hover:opacity-75"
            onClick={() => sliderRef.current?.slickNext()}
          >
            <img src={RightArrow} alt="Next" className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden w-full">
        {musicList?.length > 0 && (
          <Slider ref={sliderRef} {...settings} className="slider">
            {musicList.map((playlist) => (
              <SliderItem key={playlist.id} playlist={playlist} />
            ))}
          </Slider>
        )}
      </div>
    </div>
  );
};

export default MusicSlider;
