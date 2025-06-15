'use client'

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css/bundle';
import 'swiper/css/effect-fade';

const SliderOne = () => {
    const [banners, setBanners] = useState([]);

    useEffect(() => {
        // Fetch banners from the API
        fetch('https://www.thinkprint.shop/api/banner-api') 
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setBanners(data.data);
                }
            })
            .catch(error => console.error('Error fetching banners:', error));
    }, []);

    return (
        <>
            <div className="slider-block style-one bg-linear xl:h-[860px] lg:h-[800px] md:h-[580px] sm:h-[500px] h-[350px] max-[420px]:h-[320px] w-full">
                <div className="slider-main h-full w-full">
                    <Swiper
                        spaceBetween={0}
                        slidesPerView={1}
                        loop={true}
                        pagination={{ clickable: true }}
                        modules={[Pagination, Autoplay]}
                        className='h-full relative'
                        autoplay={{
                            delay: 4000,
                        }}
                    >
                        {banners.map((banner, index) => (
                            <SwiperSlide key={index}>
                                <div className="slider-item h-full w-full relative">
                                    {/* Make the entire slide clickable */}
                                    <Link href={banner.title} legacyBehavior>
  <a className="block h-full w-full relative">
    <Image
      src={banner.image_url}
      alt={`Banner ${index + 1}`}
      fill
      style={{ objectFit: 'cover' }}
      priority={true}
    />
  </a>
</Link>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </>
    );
};

export default SliderOne;