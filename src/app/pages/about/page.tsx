'use client'
import React from 'react'
import Image from 'next/image';
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import MenuOne from '@/components/Header/Menu/MenuOne'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import Benefit from '@/components/Home1/Benefit'
import Newsletter from '@/components/Home4/Newsletter'
import Instagram from '@/components/Home6/Instagram'
import Brand from '@/components/Home1/Brand'
import Footer from '@/components/Footer/Footer'

const AboutUs = () => {
    return (
        <>
            <TopNavOne props="style-one bg-black" slogan="🎉 Free Shipping on Bulk Orders" />
            <div id="header" className='relative w-full'>
                <MenuOne props="bg-transparent" />
                <Breadcrumb heading='About Us' subHeading='About Us' />
            </div>
            <Benefit props="md:pt-20 pt-10" />
            {/* <Newsletter props="bg-green md:mt-20 mt-10" /> */}
            {/* <Instagram /> */}
            {/* <Brand /> */}
            <Footer />
        </>
    )
}

export default AboutUs