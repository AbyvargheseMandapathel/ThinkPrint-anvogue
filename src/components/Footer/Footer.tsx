"use client"

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import * as Icon from "@phosphor-icons/react/dist/ssr";

const Footer = () => {
    const [quickShopCategories, setQuickShopCategories] = useState([]);
    const [customerServiceCategories, setCustomerServiceCategories] = useState([]);

    // Fetch and split categories into two groups
    useEffect(() => {
        const fetchSubcategories = async () => {
            try {
                const res = await fetch('https://www.thinkprint.shop/api/subcategories-api'); 
                if (!res.ok) throw new Error('Failed to fetch subcategories');

                const data = await res.json();

                if (data.success && Array.isArray(data.data)) {
                    // Shuffle array
                    const shuffled = [...data.data].sort(() => 0.5 - Math.random());

                    // First 4 for Quick Shop
                    setQuickShopCategories(shuffled.slice(0, 4));

                    // Next 4 for Customer Services
                    setCustomerServiceCategories(shuffled.slice(4, 8));
                }
            } catch (error) {
                console.error("Error fetching subcategories:", error);
            }
        };

        fetchSubcategories();
    }, []);

    return (
        <>
            <div id="footer" className="footer">
                <div className="footer-main bg-surface">
                    <div className="container">
                        <div className="content-footer py-[60px] flex justify-between flex-wrap gap-y-8">
                            {/* Company Info */}
                            <div className="company-infor basis-1/4 max-lg:basis-full pr-7">
                                <Link href="/" className="logo">
                                    <div className="heading4">Thinkprint</div>
                                </Link>
                                <div className="flex gap-3 mt-3">
                                    <div className="flex flex-col">
                                        <span className="text-button">Mail:</span>
                                        <span className="text-button mt-3">Phone:</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span>sales@thinkprint.shop</span>
                                        <span className="mt-3">+91 99538 63364</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Content */}
                            <div className="right-content flex flex-wrap gap-y-8 basis-3/4 max-lg:basis-full">
                                <div className="list-nav flex justify-between basis-2/3 max-md:basis-full gap-4">
                                    {/* Information */}
                                    <div className="item flex flex-col basis-1/3">
                                        <div className="text-button-uppercase pb-3">Information</div>
                                        <Link className="caption1 has-line-before duration-300 w-fit" href="/pages/contact">Contact us</Link>
                                        <Link className="caption1 has-line-before duration-300 w-fit pt-2" href="#!">About Us</Link>
                                        <Link className="caption1 has-line-before duration-300 w-fit pt-2" href="/my-account">My Account</Link>
                                        <Link className="caption1 has-line-before duration-300 w-fit pt-2" href="/order-tracking">Order & Returns</Link>
                                        <Link className="caption1 has-line-before duration-300 w-fit pt-2" href="/pages/faqs">FAQs</Link>
                                    </div>

                                    {/* Quick Shop */}
                                    <div className="item flex flex-col basis-1/3">
                                        <div className="text-button-uppercase pb-3">Quick Shop</div>
                                        {quickShopCategories.length > 0 ? (
                                            quickShopCategories.map((subcat) => (
                                                <Link
                                                    key={subcat.id}
                                                    className="caption1 has-line-before duration-300 w-fit pt-2"
                                                    href={`/shop/default?type=${encodeURIComponent(subcat.name.trim().toLowerCase().replace(/\s+/g, '-'))}`}
                                                >
                                                    {subcat.name.trim()}
                                                </Link>
                                            ))
                                        ) : (
                                            <p className="caption1 text-secondary">Loading...</p>
                                        )}
                                    </div>

                                    {/* Customer Services */}
                                    <div className="item flex flex-col basis-1/3">
                                        <div className="text-button-uppercase pb-3">Quick Shop</div>
                                        {quickShopCategories.length > 0 ? (
                                            quickShopCategories.map((subcat) => (
                                                <Link
                                                    key={subcat.id}
                                                    className="caption1 has-line-before duration-300 w-fit pt-2"
                                                    href={`/shop/default?type=${encodeURIComponent(subcat.name.trim().toLowerCase().replace(/\s+/g, '-'))}`}
                                                >
                                                    {subcat.name.trim()}
                                                </Link>
                                            ))
                                        ) : (
                                            <p className="caption1 text-secondary">Loading...</p>
                                        )}
                                    </div>
                                </div>

                                {/* Newsletter */}
                                <div className="newsletter basis-1/3 pl-7 max-md:basis-full max-md:pl-0">
                                    <div className="text-button-uppercase">Newsletter</div>
                                    <div className="caption1 mt-3">Sign up for our newsletter and get 10% off your first purchase</div>
                                    <div className="input-block w-full h-[52px] mt-4">
                                        <form className="w-full h-full relative" action="#">
                                            <input
                                                type="email"
                                                placeholder="Enter your e-mail"
                                                className="caption1 w-full h-full pl-4 pr-14 rounded-xl border border-line"
                                                required
                                            />
                                            <button className="w-[44px] h-[44px] bg-black flex items-center justify-center rounded-xl absolute top-1 right-1">
                                                <Icon.ArrowRight size={24} color="#fff" />
                                            </button>
                                        </form>
                                    </div>
                                    <div className="list-social flex items-center gap-6 mt-4">
                                        <Link href="https://www.facebook.com/"  target="_blank">
                                            <div className="icon-facebook text-2xl text-black"></div>
                                        </Link>
                                        <Link href="https://www.instagram.com/"  target="_blank">
                                            <div className="icon-instagram text-2xl text-black"></div>
                                        </Link>
                                        <Link href="https://www.twitter.com/"  target="_blank">
                                            <div className="icon-twitter text-2xl text-black"></div>
                                        </Link>
                                        <Link href="https://www.youtube.com/"  target="_blank">
                                            <div className="icon-youtube text-2xl text-black"></div>
                                        </Link>
                                        <Link href="https://www.pinterest.com/"  target="_blank">
                                            <div className="icon-pinterest text-2xl text-black"></div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Bottom */}
                        <div className="footer-bottom py-3 flex items-center justify-between gap-5 max-lg:justify-center max-lg:flex-col border-t border-line">
                            <div className="left flex items-center gap-8">
                                <div className="copyright caption1 text-secondary">©2023 Thinkprint. All Rights Reserved.</div>
                                <div className="select-block flex items-center gap-5 max-md:hidden">
                                    <div className="choose-language flex items-center gap-1.5">
                                        <select name="language" id="chooseLanguageFooter" className="caption2 bg-transparent">
                                            <option value="English">English</option>
                                            <option value="Espana">Espana</option>
                                            <option value="France">France</option>
                                        </select>
                                        <Icon.CaretDown size={12} color="#1F1F1F" />
                                    </div>
                                    <div className="choose-currency flex items-center gap-1.5">
                                        <select name="currency" id="chooseCurrencyFooter" className="caption2 bg-transparent">
                                            <option value="USD">USD</option>
                                            <option value="EUR">EUR</option>
                                            <option value="GBP">GBP</option>
                                        </select>
                                        <Icon.CaretDown size={12} color="#1F1F1F" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Footer;