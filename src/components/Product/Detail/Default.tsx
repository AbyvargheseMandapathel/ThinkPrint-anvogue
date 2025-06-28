'use client'

import React, { useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ProductType } from '@/type/ProductType'
import Product from '../Product'
import Rate from '@/components/Other/Rate'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, Scrollbar } from 'swiper/modules';
import 'swiper/css/bundle';
import * as Icon from "@phosphor-icons/react/dist/ssr";
import SwiperCore from 'swiper/core';
import { useCart } from '@/context/CartContext'
import { useModalCartContext } from '@/context/ModalCartContext'
import { useWishlist } from '@/context/WishlistContext'
import { useModalWishlistContext } from '@/context/ModalWishlistContext'
import { useCompare } from '@/context/CompareContext'
import { useModalCompareContext } from '@/context/ModalCompareContext'
import ModalSizeguide from '@/components/Modal/ModalSizeguide'
import { useModalEnquiryContext } from '@/context/ModalEnquiryContext'
import ModalEnquiry from '@/components/Modal/ModalEnquiry'

SwiperCore.use([Navigation, Thumbs]);

interface Props {
    data: Array<ProductType>
    productId: string | number | null
}

const Default: React.FC<Props> = ({ data, productId }) => {
    const swiperRef: any = useRef();
    const [photoIndex, setPhotoIndex] = useState(0)
    const [openPopupImg, setOpenPopupImg] = useState(false)
    const [openSizeGuide, setOpenSizeGuide] = useState<boolean>(false)
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperCore | null>(null);
    const [activeColor, setActiveColor] = useState<string>('')
    const [activeSize, setActiveSize] = useState<string>('')
    const [activeTab, setActiveTab] = useState<string | undefined>('description')
    const { addToCart, updateCart, cartState } = useCart()
    const { openModalCart } = useModalCartContext()
    const { addToWishlist, removeFromWishlist, wishlistState } = useWishlist()
    const { openModalWishlist } = useModalWishlistContext()
    const { addToCompare, removeFromCompare, compareState } = useCompare()
    const { openModalCompare } = useModalCompareContext()
    const { openModalEnquiry } = useModalEnquiryContext()
    let productMain = data.find(product => product.id === productId) as ProductType
    if (productMain === undefined) {
        productMain = data[0]
    }

    const percentSale = Math.floor(100 - ((productMain?.price / productMain?.originPrice) * 100))

    const handleOpenSizeGuide = () => {
        setOpenSizeGuide(true);
    };

    const handleCloseSizeGuide = () => {
        setOpenSizeGuide(false);
    };

    const handleSwiper = (swiper: SwiperCore) => {
        // Do something with the thumbsSwiper instance
        setThumbsSwiper(swiper);
    };

    const handleActiveColor = (item: string) => {
        setActiveColor(item)

        // // Find variation with selected color
        // const foundColor = productMain.variation.find((variation) => variation.color === item);
        // // If found, slide next to img
        // if (foundColor) {
        //     const index = productMain.images.indexOf(foundColor.image);

        //     if (index !== -1) {
        //         swiperRef.current?.slideTo(index);
        //     }
        // }
    }

    const handleActiveSize = (item: string) => {
        setActiveSize(item)
    }

    const handleIncreaseQuantity = () => {
        productMain.quantityPurchase += 1
        updateCart(productMain.id, productMain.quantityPurchase + 1, activeSize, activeColor);
    };

    const handleDecreaseQuantity = () => {
        if (productMain.quantityPurchase > 1) {
            productMain.quantityPurchase -= 1
            updateCart(productMain.id, productMain.quantityPurchase - 1, activeSize, activeColor);
        }
    };

    const handleAddToCart = () => {
        if (!cartState.cartArray.find(item => item.id === productMain.id)) {
            addToCart({ ...productMain });
            updateCart(productMain.id, productMain.quantityPurchase, activeSize, activeColor)
        } else {
            updateCart(productMain.id, productMain.quantityPurchase, activeSize, activeColor)
        }
        openModalCart()
    };
    const parseDesignSpecifications = (designString: string | undefined) => {
        if (!designString) return []
      
        const lines = designString.split('\n')
        return lines.map(line => {
          const [key, value] = line.split('\t')
          return { key, value }
        })
      }
    const handleAddToWishlist = () => {
        // if product existed in wishlit, remove from wishlist and set state to false
        if (wishlistState.wishlistArray.some(item => item.id === productMain.id)) {
            removeFromWishlist(productMain.id);
        } else {
            // else, add to wishlist and set state to true
            addToWishlist(productMain);
        }
        openModalWishlist();
    };

    const handleAddToCompare = () => {
        // if product existed in wishlit, remove from wishlist and set state to false
        if (compareState.compareArray.length < 3) {
            if (compareState.compareArray.some(item => item.id === productMain.id)) {
                removeFromCompare(productMain.id);
            } else {
                // else, add to wishlist and set state to true
                addToCompare(productMain);
            }
        } else {
            alert('Compare up to 3 products')
        }

        openModalCompare();
    };

    const handleActiveTab = (tab: string) => {
        setActiveTab(tab)
    }

    const handleEnquireNow = () => {
        console.log("enquire now")
        openModalEnquiry(productMain)
    }


    return (
        <>
            <div className="product-detail default">
                <div className="featured-product underwear md:py-20 py-10">
                    <div className="container flex justify-between gap-y-6 flex-wrap">
                        <div className="list-img md:w-1/2 md:pr-[45px] w-full">
                            <Swiper
                                slidesPerView={1}
                                spaceBetween={0}
                                thumbs={{ swiper: thumbsSwiper }}
                                modules={[Thumbs]}
                                className="mySwiper2 rounded-2xl overflow-hidden"
                            >
                                {productMain.images.map((item, index) => (
                                    <SwiperSlide
                                        key={index}
                                        onClick={() => {
                                            swiperRef.current?.slideTo(index);
                                            setOpenPopupImg(true)
                                        }}
                                    >
                                        <Image
                                            src={item}
                                            width={1000}
                                            height={1000}
                                            alt='prd-img'
                                            className='w-full aspect-[3/4] object-contain' // changed from object-cover to object-contain
                                        />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                            <Swiper
                                onSwiper={(swiper) => {
                                    handleSwiper(swiper)
                                }}
                                spaceBetween={0}
                                slidesPerView={4}
                                freeMode={true}
                                watchSlidesProgress={true}
                                modules={[Navigation, Thumbs]}
                                className="mySwiper"
                            >
                                {productMain.images.map((item, index) => (
                                    <SwiperSlide
                                        key={index}
                                    >
                                        <Image
                                            src={item}
                                            width={1000}
                                            height={1000}
                                            alt='prd-img'
                                            className='w-full aspect-[3/4] object-contain rounded-xl' // changed from object-cover to object-contain
                                        />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                            <div className={`popup-img ${openPopupImg ? 'open' : ''}`}>
                                <span
                                    className="close-popup-btn absolute top-4 right-4 z-[2] cursor-pointer"
                                    onClick={() => {
                                        setOpenPopupImg(false)
                                    }}
                                >
                                    <Icon.X className="text-3xl text-white" />
                                </span>
                                <Swiper
                                    spaceBetween={0}
                                    slidesPerView={1}
                                    modules={[Navigation, Thumbs]}
                                    navigation={true}
                                    loop={true}
                                    className="popupSwiper"
                                    onSwiper={(swiper) => {
                                        swiperRef.current = swiper
                                    }}
                                >
                                    {productMain.images.map((item, index) => (
                                        <SwiperSlide
                                            key={index}
                                            onClick={() => {
                                                setOpenPopupImg(false)
                                            }}
                                        >
                                            <Image
                                                src={item}
                                                width={1000}
                                                height={1000}
                                                alt='prd-img'
                                                className='w-full aspect-[3/4] object-contain rounded-xl' // changed from object-cover to object-contain
                                                onClick={(e) => {
                                                    e.stopPropagation(); // prevent
                                                }}
                                            />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                        </div>
                        <div className="product-infor md:w-1/2 w-full lg:pl-[15px] md:pl-2">
                            <div className="flex justify-between">
                                <div>
                                    <div className="caption2 text-secondary font-semibold uppercase">{productMain.type}</div>
                                    <div className="heading4 mt-1">{productMain.name}</div>
                                </div>
                                <div
                                    className={`add-wishlist-btn w-12 h-12 flex items-center justify-center border border-line cursor-pointer rounded-xl duration-300 hover:bg-black hover:text-white ${wishlistState.wishlistArray.some(item => item.id === productMain.id) ? 'active' : ''}`}
                                    onClick={handleAddToWishlist}
                                >
                                    {wishlistState.wishlistArray.some(item => item.id === productMain.id) ? (
                                        <>
                                            <Icon.Heart size={24} weight='fill' className='text-white' />
                                        </>
                                    ) : (
                                        <>
                                            <Icon.Heart size={24} />
                                        </>
                                    )}
                                </div>
                            </div>
                            
                      {/* Description and About This Products - Desktop View */}
<div className="md:block hidden mt-6">
  <div className='grid gap-8 gap-y-5'>
    <div className="description-section">
      <div className="heading6">Description</div>
      <div className="text-secondary mt-2">{productMain.description}</div>
    </div>

    <div className="about-section">
      <div className="heading6">About This Product</div>
      <div className="list-feature">
        {/* Dynamic Design Specifications */}
        {productMain.design && (
          parseDesignSpecifications(productMain.design).map((spec, index) => (
            <div key={index} className="item flex gap-1 text-secondary mt-1">
              <Icon.Dot size={28} />
              <p>
                <strong>{spec.key}</strong> {spec.value || ''}
              </p>
            </div>
          ))
        )}

        {/* Fallback if no design specs */}
        {!productMain.design && (
          <div className="item flex gap-1 text-secondary mt-1">
            <Icon.Dot size={28} />
            <p>No additional specifications available.</p>
          </div>
        )}
      </div>

      <button 
        className="button-main mt-4 px-5 py-3 rounded-lg"
        onClick={handleEnquireNow}
      >
        Enquire Now
      </button>
    </div>
  </div>
</div>

                                       
                        </div>
                    </div>
                </div>
                
                {/* Description and About This Products - Mobile View (Bottom) */}
                <div className="md:hidden block py-8">
                    <div className="container">
                        <div className='grid gap-8 gap-y-5'>
                            <div className="description-section">
                                <div className="heading6">Description</div>
                                <div className="text-secondary mt-2">{productMain.description}</div>
                            </div>
                            <div className="about-section">
  <div className="heading6">About This Product</div>
  <div className="list-feature">
    {/* Dynamic Design Specifications */}
    {productMain.design && (
      parseDesignSpecifications(productMain.design).map((spec, index) => (
        <div key={index} className="item flex gap-1 text-secondary mt-1">
          <Icon.Dot size={28} />
          <p>
            <strong>{spec.key}:</strong> {spec.value}
          </p>
        </div>
      ))
    )}

    {/* Optional Static Fallback */}
    {!productMain.design && (
      <>
        <div className="item flex gap-1 text-secondary mt-1">
          <Icon.Dot size={28} />
          <p>No additional specifications available.</p>
        </div>
      </>
    )}

    {/* Optional: Keep static examples hidden when design specs exist */}
    {productMain.design ? null : (
      <>
        <div className="item flex gap-1 text-secondary mt-1">
          <Icon.Dot size={28} />
          <p>Nulla luctus libero quis mauris vestibulum dapibus.</p>
        </div>
        <div className="item flex gap-1 text-secondary mt-1">
          <Icon.Dot size={28} />
          <p>Maecenas ullamcorper erat mi, vel consequat enim suscipit at.</p>
        </div>
        <div className="item flex gap-1 text-secondary mt-1">
          <Icon.Dot size={28} />
          <p>Quisque consectetur nibh ac urna molestie scelerisque.</p>
        </div>
        <div className="item flex gap-1 text-secondary mt-1">
          <Icon.Dot size={28} />
          <p>Mauris in nisl scelerisque massa consectetur pretium sed et mauris.</p>
        </div>
      </>
    )}
  </div>

                                <button 
                                    className="button-main mt-4 px-5 py-3 rounded-lg"
                                    onClick={handleEnquireNow}
                                >
                                    Enquire Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ModalEnquiry data={productMain} />
        </>
    )
}

export default Default