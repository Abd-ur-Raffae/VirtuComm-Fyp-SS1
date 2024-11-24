import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation'; // Import Swiper navigation styles

const MySwiper = () => {
  return (
    <Swiper
      spaceBetween={50}
      slidesPerView={1}
      navigation={{
        prevEl: '.swiper-button-prev', // Custom previous button
        nextEl: '.swiper-button-next', // Custom next button
      }}
      pagination={{ clickable: true }}
      scrollbar={{ draggable: true }}
    >
      {/* First Slide */}
      <SwiperSlide>
        <div className="case-item position-relative overflow-hidden rounded mb-2" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <img className="img-fluid" src="/img/banda.png" alt="Basic 3D Model" style={{ width: '100%', height: 'auto' }} />
          <a className="case-overlay text-decoration-none" href="#!">
            <small>Phase 1.1</small>
            <h5 className="lh-base text-white mb-3">Basic 3D Model </h5>
            <a className="btn btn-square btn-primary" href="/stage1_1">
              <i className="fa fa-arrow-right" />
            </a>
          </a>
        </div>
      </SwiperSlide>

      {/* Second Slide */}
      <SwiperSlide>
        <div className="case-item position-relative overflow-hidden rounded mb-2" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <img className="img-fluid" src="/img/banda1.2.png" alt="Basic Dual 3D Model" style={{ width: '100%', height: 'auto' }} />
          <a className="case-overlay text-decoration-none" href="#!">
            <small>Phase 1.2</small>
            <h5 className="lh-base text-white mb-3">Basic Dual 3D Model </h5>
            <a className="btn btn-square btn-primary" href="/stage1_2">
              <i className="fa fa-arrow-right" />
            </a>
          </a>
        </div>
      </SwiperSlide>

      {/* Custom Navigation Arrows */}
      <div className="swiper-button-prev">
        <i className="fa fa-arrow-left" style={{ color: 'white', fontSize: '24px' }}></i>
      </div>
      <div className="swiper-button-next">
        <i className="fa fa-arrow-right" style={{ color: 'white', fontSize: '24px' }}></i>
      </div>
    </Swiper>
  );
};

export default MySwiper;
