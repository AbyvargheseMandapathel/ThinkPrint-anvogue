'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation } from 'swiper/modules'
import 'swiper/css/bundle'

const CategoryHome = () => {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch('https://www.thinkprint.shop/api/categories-api') 
                const data = await res.json()
                if (data.success) {
                    setCategories(data.data)
                }
            } catch (error) {
                console.error('Failed to load categories:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchCategories()
    }, [])

    return (
        <>
            <div className="trending-block style-six md:pt-20 pt-10">
                <div className="container">
                    <div className="heading3 text-center">Categories</div>

                    {loading ? (
                        <div className="flex justify-center py-6">Loading categories...</div>
                    ) : (
                        <div className="list-trending section-swiper-navigation style-small-border style-outline md:mt-10 mt-6">
                            <Swiper
                                spaceBetween={12}
                                slidesPerView={2}
                                navigation
                                loop={true}
                                modules={[Navigation, Autoplay]}
                                autoplay={{ delay: 3000 }}
                                breakpoints={{
                                    576: { slidesPerView: 3, spaceBetween: 12 },
                                    768: { slidesPerView: 4, spaceBetween: 20 },
                                    992: { slidesPerView: 5, spaceBetween: 20 },
                                    1290: { slidesPerView: 6, spaceBetween: 30 },
                                }}
                                className='h-full'
                            >
                                {/* Duplicate slides to ensure infinite loop */}
                                {[
                                    ...categories,
                                    ...categories.slice(0, 6), // Add extra copies to prevent loop issues
                                ].map((category: any, index: number) => (
                                    <SwiperSlide key={`slide-${category.id}-${index}`} virtualIndex={category.id}>
                                        <Link
                                            href={`/shop/default?category=${encodeURIComponent(category.name)}`}
                                            className="trending-item block relative cursor-pointer"
                                        >
                                            <div className="bg-img rounded-full overflow-hidden">
                                                <Image
                                                    src={category.img || '/images/avatar/default.png'}
                                                    width={1000}
                                                    height={1000}
                                                    alt={category.name}
                                                    priority={true}
                                                    className='w-full'
                                                />
                                            </div>
                                            <div className="trending-name text-center mt-5 duration-500">
                                                <span className='heading5'>{category.name}</span>
                                                {/* <span className='text-secondary'> (12)</span> */}
                                            </div>
                                        </Link>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default CategoryHome