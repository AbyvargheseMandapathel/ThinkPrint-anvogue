'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { usePathname } from 'next/navigation';
import useLoginPopup from '@/store/useLoginPopup';
import useMenuMobile from '@/store/useMenuMobile';
import { useModalCartContext } from '@/context/ModalCartContext';
import { useModalWishlistContext } from '@/context/ModalWishlistContext';
import { useModalSearchContext } from '@/context/ModalSearchContext';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

interface Props {
    props: string;
}

const MenuOne: React.FC<Props> = ({ props }) => {
    const router = useRouter();
    const pathname = usePathname();

    // State for categories and subcategories
    const [categoryGroups, setCategoryGroups] = useState<any[]>([]);

    // UI states
    const [selectedType, setSelectedType] = useState<string | null>();
    const { openLoginPopup, handleLoginPopup } = useLoginPopup();
    const { openMenuMobile, handleMenuMobile } = useMenuMobile();
    const [openSubNavMobile, setOpenSubNavMobile] = useState<number | null>(null);
    const { openModalCart } = useModalCartContext();
    const { cartState } = useCart();
    const { openModalWishlist } = useModalWishlistContext();
    const { openModalSearch } = useModalSearchContext();
    const [fixedHeader, setFixedHeader] = useState(false);
    const [lastScrollPosition, setLastScrollPosition] = useState(0);

    // Fetch and combine data on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoriesRes = await fetch('/api/categories-api'); 
                const subcategoriesRes = await fetch('/api/subcategories-api'); 
                const categoriesData = await categoriesRes.json();
                const subcategoriesData = await subcategoriesRes.json();

                // Create a map to associate categories with their subcategories
                const categoryMap: { [key: number]: any } = {};
                categoriesData.data.forEach((cat: any) => {
                    categoryMap[cat.id] = {
                        ...cat,
                        subcategories: [],
                    };
                });

                subcategoriesData.data.forEach((sub: any) => {
                    if (categoryMap[sub.category_id]) {
                        categoryMap[sub.category_id].subcategories.push(sub);
                    }
                });

                // Convert the map to an array
                let categoryArray = Object.values(categoryMap);

                // Sort categories by the number of subcategories in descending order
                categoryArray.sort((a, b) => b.subcategories.length - a.subcategories.length);

                // Update the state with sorted categories
                setCategoryGroups(categoryArray);
            } catch (error) {
                console.error("Failed to load categories", error);
            }
        };

        fetchData();
    }, []);

    // Scroll handler
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            setFixedHeader(scrollPosition > 0 && scrollPosition < lastScrollPosition);
            setLastScrollPosition(scrollPosition);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollPosition]);

    // Navigation handlers
    const handleGenderClick = (gender: string) => {
        router.push(`/shop/default?gender=${gender}`);
    };

    const handleCategoryClick = (category: string) => {
        router.push(`/shop/default?category=${category}`);
    };

    const handleTypeClick = (type: string) => {
        setSelectedType(type);
        router.push(`/shop/default?type=${type}`);
    };

    const handleOpenSubNavMobile = (index: number) => {
        setOpenSubNavMobile(openSubNavMobile === index ? null : index);
    };

    return (
        <>
            {/* Header */}
            <div className={`header-menu style-one ${fixedHeader ? 'fixed' : 'absolute'} top-0 left-0 right-0 w-full md:h-[74px] h-[56px] ${props}`}>
                <div className="container mx-auto h-full">
                    <div className="header-main flex justify-between h-full">
                        {/* Mobile menu icon */}
                        <div className="menu-mobile-icon lg:hidden flex items-center" onClick={handleMenuMobile}>
                            <i className="icon-category text-2xl"></i>
                        </div>
                        {/* Left section: Logo + Main Nav */}
                        <div className="left flex items-center gap-16">
                            <Link href={'/'} className='flex items-center max-lg:absolute max-lg:left-1/2 max-lg:-translate-x-1/2'>
                                <div className="heading4">ThinkPrint</div>
                            </Link>
                            {/* Desktop Mega Menu */}
                            <div className="menu-main h-full max-lg:hidden">
                                <ul className='flex items-center gap-8 h-full'>
                                    <li className='h-full relative'>
                                        <Link
                                            href="/"
                                            className={`text-button-uppercase duration-300 h-full flex items-center justify-center gap-1 ${pathname === '/' ? 'active' : ''}`}
                                        >
                                            Home
                                        </Link>
                                    </li>
                                    <li className='h-full'>
                                        <Link href="" className='text-button-uppercase duration-300 h-full flex items-center justify-center'>
                                            Categories
                                        </Link>
                                        {/* Dynamic Mega Menu */}
                                        <div className="mega-menu absolute top-[74px] left-0 bg-white w-screen">
                                            <div className="container">
                                                <div className="flex justify-between py-8">
                                                    <div className="nav-link basis-2/3 grid grid-cols-4 gap-y-8">
                                                        {/* Render dynamic categories */}
                                                        {categoryGroups.map((category) => (
                                                            <div key={category.id} className="nav-item">
                                                                <div className="text-button-uppercase pb-2">{category.name}</div>
                                                                <ul>
                                                                    {category.subcategories.length > 0 ? (
                                                                        category.subcategories.map((sub: any) => (
                                                                            <li key={sub.id}>
                                                                                <div
                                                                                    onClick={() => handleTypeClick(sub.name.toLowerCase().replace(/\s+/g, '-'))}
                                                                                    className="link text-secondary duration-300 cursor-pointer"
                                                                                >
                                                                                    {sub.name}
                                                                                </div>
                                                                            </li>
                                                                        ))
                                                                    ) : (
                                                                        <li><span className="text-gray-400 italic">No subcategories</span></li>
                                                                    )}
                                                                    <li>
                                                                        <div
                                                                            onClick={() => handleCategoryClick(category.name.toLowerCase().replace(/\s+/g, '-'))}
                                                                            className="link text-secondary duration-300 view-all-btn cursor-pointer"
                                                                        >
                                                                            View All
                                                                        </div>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    {/* Banner Ads */}
                                                    <div className="banner-ads-block pl-2.5 basis-1/3">
                                                        <div className="banner-ads-item bg-linear rounded-2xl relative overflow-hidden cursor-pointer" onClick={() => handleTypeClick('swimwear')}>
                                                            <div className="text-content py-14 pl-8 relative z-[1]">
                                                                <div className="text-button-uppercase text-white bg-red px-2 py-0.5 inline-block rounded-sm">Save $10</div>
                                                                <div className="heading6 mt-2">Dive into Savings <br />on Swimwear</div>
                                                                <div className="body1 mt-3 text-secondary">
                                                                    Starting at <span className='text-red'>$59.99</span>
                                                                </div>
                                                            </div>
                                                            <Image
                                                                src={'/images/slider/bg2-2.png'}
                                                                width={200}
                                                                height={100}
                                                                alt='bg-img'
                                                                className='basis-1/3 absolute right-0 top-0 duration-700'
                                                            />
                                                        </div>
                                                        <div className="banner-ads-item bg-linear rounded-2xl relative overflow-hidden cursor-pointer mt-8" onClick={() => handleTypeClick('accessories')}>
                                                            <div className="text-content py-14 pl-8 relative z-[1]">
                                                                <div className="text-button-uppercase text-white bg-red px-2 py-0.5 inline-block rounded-sm">Save $10</div>
                                                                <div className="heading6 mt-2">20% off <br />accessories</div>
                                                                <div className="body1 mt-3 text-secondary">
                                                                    Starting at <span className='text-red'>$59.99</span>
                                                                </div>
                                                            </div>
                                                            <Image
                                                                src={'/images/other/bg-feature.png'}
                                                                width={200}
                                                                height={100}
                                                                alt='bg-img'
                                                                className='basis-1/3 absolute right-0 top-0 duration-700'
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                    {/* Other Static Links */}
                                    <li className='h-full'>
                                        <Link
                                            href="/pages/about"
                                            className={`text-button-uppercase duration-300 h-full flex items-center justify-center ${pathname.includes('/pages/about') ? 'active' : ''}`}
                                        >
                                            About
                                        </Link>
                                    </li>
                                    <li className='h-full'>
                                        <Link
                                            href="/shop/default"
                                            className={`text-button-uppercase duration-300 h-full flex items-center justify-center ${pathname.includes('shop/default') ? 'active' : ''}`}
                                        >
                                            Products
                                        </Link>
                                    </li>
                                    <li className='h-full relative'>
                                        <Link href="/pages/contact" className={`text-button-uppercase duration-300 h-full flex items-center justify-center ${pathname.includes('/pages/contact') ? 'active' : ''}`}>
                                            Contact Us
                                        </Link>
                                    </li>
                                    <li className='h-full relative'>
                                        <Link href="/shop/urbangear" className={`text-button-uppercase duration-300 h-full flex items-center justify-center ${pathname.includes('/shop/urbangear') ? 'active' : ''}`}>
                                            Urban Gear
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        {/* Right section: Search, User, Wishlist, Cart */}
                        <div className="right flex gap-12">
                            <div className="max-md:hidden search-icon flex items-center cursor-pointer relative">
                                <Icon.MagnifyingGlass size={24} color='black' onClick={openModalSearch} />
                                <div className="line absolute bg-line w-px h-6 -right-6"></div>
                            </div>
                            {/* <div className="list-action flex items-center gap-4">
                                <div className="user-icon flex items-center justify-center cursor-pointer">
                                    <Icon.User size={24} color='black' onClick={handleLoginPopup} />
                                    <div
                                        className={`login-popup absolute top-[74px] w-[320px] p-7 rounded-xl bg-white box-shadow-sm 
                                            ${openLoginPopup ? 'open' : ''}`}
                                    >
                                        <Link href={'/login'} className="button-main w-full text-center">Login</Link>
                                        <div className="text-secondary text-center mt-3 pb-4">Donâ€™t have an account?
                                            <Link href={'/register'} className='text-black pl-1 hover:underline'>Register</Link>
                                        </div>
                                        <Link href={'/my-account'} className="button-main bg-white text-black border border-black w-full text-center">Dashboard</Link>
                                        <div className="bottom mt-4 pt-4 border-t border-line"></div>
                                        <Link href={'#!'} className='body1 hover:underline'>Support</Link>
                                    </div>
                                </div>
                                <div className="max-md:hidden wishlist-icon flex items-center cursor-pointer" onClick={openModalWishlist}>
                                    <Icon.Heart size={24} color='black' />
                                </div>
                                <div className="cart-icon flex items-center relative cursor-pointer" onClick={openModalCart}>
                                    <Icon.Handbag size={24} color='black' />
                                    <span className="quantity cart-quantity absolute -right-1.5 -top-1.5 text-xs text-white bg-black w-4 h-4 flex items-center justify-center rounded-full">{cartState.cartArray.length}</span>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
            {/* Mobile Menu Drawer */}
            <div id="menu-mobile" className={`${openMenuMobile ? 'open' : ''}`}>
                <div className="menu-container bg-white h-full">
                    <div className="container h-full">
                        <div className="menu-main h-full overflow-hidden">
                            {/* Header + Close Button */}
                            <div className="heading py-2 relative flex items-center justify-center">
                                <div
                                    className="close-menu-mobile-btn absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-surface flex items-center justify-center"
                                    onClick={handleMenuMobile}
                                >
                                    <Icon.X size={14} />
                                </div>
                                <Link href={'/'} className='logo text-3xl font-semibold text-center'>Thinkprint</Link>
                            </div>
                            {/* Search Bar */}
                            <div className="form-search relative mt-2">
                                <Icon.MagnifyingGlass size={20} className='absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer' />
                                <input type="text" placeholder='What are you looking for?' className=' h-12 rounded-lg border border-line text-sm w-full pl-10 pr-4' />
                            </div>
                            {/* Mobile Nav Links */}
                            <div className="list-nav mt-6">
                                <ul>
                                    <li
                                        className={`${openSubNavMobile === 1 ? 'open' : ''}`}
                                        onClick={() => handleOpenSubNavMobile(1)}
                                    >
                                        <a href={''} className={`text-xl font-semibold flex items-center justify-between`}>Home
                                            <span className='text-right'>
                                                <Icon.CaretRight size={20} />
                                            </span>
                                        </a>
                                        <div className="sub-nav-mobile">
                                            <div
                                                className="back-btn flex items-center gap-3"
                                                onClick={() => handleOpenSubNavMobile(1)}
                                            >
                                                <Icon.CaretLeft />
                                                Back
                                            </div>
                                        </div>
                                    </li>
                                    {/* Mobile Categories */}
                                    <li
                                        className={`${openSubNavMobile === 2 ? 'open' : ''}`}
                                    >
                                        <div 
                                            className='text-xl font-semibold flex items-center justify-between mt-5 cursor-pointer'
                                            onClick={() => handleOpenSubNavMobile(2)}
                                        >Categories
                                            <span className='text-right'>
                                                <Icon.CaretRight size={20} />
                                            </span>
                                        </div>
                                        <div className="sub-nav-mobile">
                                            <div
                                                className="back-btn flex items-center gap-3"
                                                onClick={() => handleOpenSubNavMobile(2)}
                                            >
                                                <Icon.CaretLeft />
                                                Back
                                            </div>
                                            <div className="list-nav-item w-full pt-3 pb-12">
                                                <div className="nav-link grid grid-cols-2 gap-5 gap-y-6">
                                                    {/* Render dynamic categories in mobile grid */}
                                                    {categoryGroups.map((category) => (
                                                        <div key={category.id} className="nav-item">
                                                            <div className="text-button-uppercase pb-1">{category.name}</div>
                                                            <ul>
                                                                {category.subcategories.length > 0 ? (
                                                                    category.subcategories.map((sub: any) => (
                                                                        <li key={sub.id}>
                                                                            <div
                                                                                onClick={() => handleTypeClick(sub.name.toLowerCase().replace(/\s+/g, '-'))}
                                                                                className="link text-secondary duration-300 cursor-pointer"
                                                                            >
                                                                                {sub.name}
                                                                            </div>
                                                                        </li>
                                                                    ))
                                                                ) : (
                                                                    <li><span className="text-gray-400 italic">No subcategories</span></li>
                                                                )}
                                                                <li>
                                                                    <div
                                                                        onClick={() => handleCategoryClick(category.name.toLowerCase().replace(/\s+/g, '-'))}
                                                                        className="link text-secondary duration-300 view-all-btn cursor-pointer"
                                                                    >
                                                                        View All
                                                                    </div>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    ))}
                                                </div>
                                                {/* Mobile banners */}
                                                <div className="banner-ads-block grid sm:grid-cols-2 items-center gap-6 pt-6">
                                                    <div className="banner-ads-item bg-linear rounded-2xl relative overflow-hidden" onClick={() => handleTypeClick('swimwear')}>
                                                        <div className="text-content py-14 pl-8 relative z-[1]">
                                                            <div className="text-button-uppercase text-white bg-red px-2 py-0.5 inline-block rounded-sm">Save $10</div>
                                                            <div className="heading6 mt-2">Dive into Savings <br />on Swimwear</div>
                                                            <div className="body1 mt-3 text-secondary">
                                                                Starting at <span className='text-red'>$59.99</span>
                                                            </div>
                                                        </div>
                                                        <Image
                                                            src={'/images/slider/bg2-2.png'}
                                                            width={200}
                                                            height={100}
                                                            alt='bg-img'
                                                            className='basis-1/3 absolute right-0 top-0'
                                                        />
                                                    </div>
                                                    <div className="banner-ads-item bg-linear rounded-2xl relative overflow-hidden" onClick={() => handleTypeClick('accessories')}>
                                                        <div className="text-content py-14 pl-8 relative z-[1]">
                                                            <div className="text-button-uppercase text-white bg-red px-2 py-0.5 inline-block rounded-sm">Save $10</div>
                                                            <div className="heading6 mt-2">20% off <br />accessories</div>
                                                            <div className="body1 mt-3 text-secondary">
                                                                Starting at <span className='text-red'>$59.99</span>
                                                            </div>
                                                        </div>
                                                        <Image
                                                            src={'/images/other/bg-feature.png'}
                                                            width={200}
                                                            height={100}
                                                            alt='bg-img'
                                                            className='basis-1/3 absolute right-0 top-0'
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                    {/* Static Mobile Items */}
                                    <li
                                        className={`${openSubNavMobile === 3 ? 'open' : ''}`}
                                        onClick={() => handleOpenSubNavMobile(3)}
                                    >
                                        <a href={'/pages/about'} className='text-xl font-semibold flex items-center justify-between mt-5'>About Us
                                            <span className='text-right'>
                                                <Icon.CaretRight size={20} />
                                            </span>
                                        </a>
                                        <div className="sub-nav-mobile">
                                            <div
                                                className="back-btn flex items-center gap-3"
                                                onClick={() => handleOpenSubNavMobile(3)}
                                            >
                                                <Icon.CaretLeft />
                                                Back
                                            </div>
                                        </div>
                                    </li>
                                    <li
                                        className={`${openSubNavMobile === 4 ? 'open' : ''}`}
                                        onClick={() => handleOpenSubNavMobile(4)}
                                    >
                                        <a href={'/shop/default'} className='text-xl font-semibold flex items-center justify-between mt-5'>Product
                                            <span className='text-right'>
                                                <Icon.CaretRight size={20} />
                                            </span>
                                        </a>
                                        <div className="sub-nav-mobile">
                                            <div
                                                className="back-btn flex items-center gap-3"
                                                onClick={() => handleOpenSubNavMobile(4)}
                                            >
                                                <Icon.CaretLeft />
                                                Back
                                            </div>
                                        </div>
                                    </li>
                                    <li
                                        className={`${openSubNavMobile === 5 ? 'open' : ''}`}
                                        onClick={() => handleOpenSubNavMobile(5)}
                                    >
                                        <a href={'/pages/contact'} className='text-xl font-semibold flex items-center justify-between mt-5'>Contact Us
                                            <span className='text-right'>
                                                <Icon.CaretRight size={20} />
                                            </span>
                                        </a>
                                    </li>
                                    <li
                                        className={`${openSubNavMobile === 6 ? 'open' : ''}`}
                                        onClick={() => handleOpenSubNavMobile(6)}
                                    >
                                        <a href={'/shop/urbangear'} className='text-xl font-semibold flex items-center justify-between mt-5'>Urban Gear
                                            <span className='text-right'>
                                                <Icon.CaretRight size={20} />
                                            </span>
                                        </a>
                                        <div className="sub-nav-mobile">
                                            <div
                                                className="back-btn flex items-center gap-3"
                                                onClick={() => handleOpenSubNavMobile(6)}
                                            >
                                                <Icon.CaretLeft />
                                                Back
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Bottom Action Bar (Mobile Only) */}
            <div className="menu_bar fixed bg-white bottom-0 left-0 w-full h-[70px] sm:hidden z-[101]">
                <div className="menu_bar-inner grid grid-cols-4 items-center h-full">
                    <Link href={'/'} className='menu_bar-link flex flex-col items-center gap-1'>
                        <Icon.House weight='bold' className='text-2xl' />
                        <span className="menu_bar-title caption2 font-semibold">Home</span>
                    </Link>
                    <Link href={'/shop/default'} className='menu_bar-link flex flex-col items-center gap-1'>
                        <Icon.List weight='bold' className='text-2xl' />
                        <span className="menu_bar-title caption2 font-semibold">Category</span>
                    </Link>
                    <Link href={'/search-result'} className='menu_bar-link flex flex-col items-center gap-1'>
                        <Icon.MagnifyingGlass weight='bold' className='text-2xl' />
                        <span className="menu_bar-title caption2 font-semibold">Search</span>
                    </Link>
                    <Link href={'/pages/contact'} className='menu_bar-link flex flex-col items-center gap-1'>
                        <div className="icon relative">
                            <Icon.PhoneCall weight='bold' className='text-2xl' />
                        </div>
                        <span className="menu_bar-title caption2 font-semibold">Contact Us</span>
                    </Link>
                </div>
            </div>
        </>
    );
};

export default MenuOne;