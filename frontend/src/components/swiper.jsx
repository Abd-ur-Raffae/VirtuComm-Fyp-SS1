import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';


const MySwiper = () => {
  return (
    <Swiper
      spaceBetween={50}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      scrollbar={{ draggable: true }}
    >
      {/* First Slide */}
      <SwiperSlide>
        <div className="case-item position-relative overflow-hidden rounded mb-2" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <img className="img-fluid" src="/img/banda.png" alt="" style={{ width: '100%', height: 'auto' }}/>
          <a className="case-overlay text-decoration-none" href>
            <small>Phase 1.1</small>
            <h5 className="lh-base text-white mb-3">Basic 3D Model </h5>
            <a className="btn btn-square btn-primary" href='/projects'>
              <i className="fa fa-arrow-right" />
            </a>
          </a>
        </div>
      </SwiperSlide>


      {/* Second Slide */}
      <SwiperSlide>
        <div className="p-5 bg-danger text-white text-center">
          <h2>Stage 1.2</h2>
          <p>This is the content of the second slide.</p>
        </div>
      </SwiperSlide>
    </Swiper>
  );
};

export default MySwiper;
