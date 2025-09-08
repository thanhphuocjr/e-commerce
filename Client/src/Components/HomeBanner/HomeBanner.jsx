import React from 'react';
import Slider from 'react-slick';
import './HomeBanner.scss';
import banner1 from '../../assets/images/Banner/Banner-1.jpg';
import banner2 from '../../assets/images/Banner/Banner-2.jpg';
import banner3 from '../../assets/images/Banner/Banner-3.jpg';
import banner4 from '../../assets/images/Banner/Banner-4.jpg';
import banner5 from '../../assets/images/Banner/Banner-5.jpg';
import banner6 from '../../assets/images/Banner/Banner-6.jpg';

import { useNavigate } from 'react-router-dom';
const HomeBanner = () => {
  const navigate = useNavigate();
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
  };
  const banners = [banner1, banner2, banner3, banner4, banner5, banner6];
  return (
    <div className="homeBannerSection">
      <Slider {...settings}>
        {banners.map((banner, index) => (
          <div
            key={index}
            className="item"
            onClick={() => navigate('/product/1')}
          >
            <img src={banner} className="w-100" />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HomeBanner;
