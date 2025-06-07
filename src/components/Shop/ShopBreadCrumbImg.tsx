'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image';
import Link from 'next/link'
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { ProductType, CategoryType } from '@/type/ProductType'
import Product from '../Product/Product';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css'
import HandlePagination from '../Other/HandlePagination';
import { useRouter, useSearchParams } from 'next/navigation';

interface Props {
    data: Array<ProductType>;
    productPerPage: number;
    dataType: string | null;
    categories?: CategoryType[];
    categoryFilter?: string | null;
}

const ShopBreadCrumbImg: React.FC<Props> = ({ data, productPerPage, dataType, categories = [], categoryFilter }) => {
    const router = useRouter();
    const [layoutCol, setLayoutCol] = useState<number | null>(4)
    const [showOnlySale, setShowOnlySale] = useState(false)
    const [sortOption, setSortOption] = useState('');
    const [openSidebar, setOpenSidebar] = useState(false)
    const [type, setType] = useState<string | null>(dataType)
    const [category, setCategory] = useState<string | null>(categoryFilter)
    const [size, setSize] = useState<string | null>()
    const [color, setColor] = useState<string | null>()
    const [brand, setBrand] = useState<string | null>()
    const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 100 });
    const [currentPage, setCurrentPage] = useState(0);
    const productsPerPage = productPerPage;
    const offset = currentPage * productsPerPage;

    // Set category from URL parameter when component mounts or when categoryFilter changes
    useEffect(() => {
        setCategory(categoryFilter);
    }, [categoryFilter]);

    const handleLayoutCol = (col: number) => {
        setLayoutCol(col)
    }

    const handleShowOnlySale = () => {
        setShowOnlySale(toggleSelect => !toggleSelect)
        setCurrentPage(0);
    }

    const handleSortChange = (option: string) => {
        setSortOption(option);
        setCurrentPage(0);
    };

    const handleOpenSidebar = () => {
        setOpenSidebar(toggleOpen => !toggleOpen)
        setCurrentPage(0);
    }

    const handleType = (type: string) => {
        setType((prevType) => (prevType === type ? null : type))
        setCurrentPage(0);
        router.push(`/shop/default?type=${type}`);
    }

    const handleCategory = (categoryName: string) => {
        setCategory((prevCategory) => (prevCategory === categoryName ? null : categoryName))
        setCurrentPage(0);
        router.push(`/shop/default?category=${encodeURIComponent(categoryName)}`);
    }

    const handleSize = (size: string) => {
        setSize((prevSize) => (prevSize === size ? null : size))
        setCurrentPage(0);
    }

    const handlePriceChange = (values: number | number[]) => {
        if (Array.isArray(values)) {
            setPriceRange({ min: values[0], max: values[1] });
            setCurrentPage(0);
        }
    };

    const handleColor = (color: string) => {
        setColor((prevColor) => (prevColor === color ? null : color))
        setCurrentPage(0);
    }

    const handleBrand = (brand: string) => {
        setBrand((prevBrand) => (prevBrand === brand ? null : brand));
        setCurrentPage(0);
    }

    // Filter product
    let filteredData = data.filter(product => {
        let isShowOnlySaleMatched = true;
        if (showOnlySale) {
            isShowOnlySaleMatched = product.sale
        }

        let isDataTypeMatched = true;
        if (dataType) {
            isDataTypeMatched = product.type === dataType
        }

        let isTypeMatched = true;
        if (type) {
            isTypeMatched = product.type === type;
        }

        let isCategoryMatched = true;
        if (category) {
            // Normalize both for comparison (case-insensitive)
            const normalizedProductCategory = product.category.toLowerCase();
            const normalizedCategory = category.toLowerCase();
            isCategoryMatched = normalizedProductCategory === normalizedCategory;
        }

        let isSizeMatched = true;
        if (size && product.sizes) {
            isSizeMatched = product.sizes.includes(size)
        }

        let isPriceRangeMatched = true;
        if (priceRange.min !== 0 || priceRange.max !== 100) {
            isPriceRangeMatched = product.price >= priceRange.min && product.price <= priceRange.max;
        }

        let isColorMatched = true;
        if (color && product.variation) {
            isColorMatched = product.variation.some(item => item.color === color)
        }

        let isBrandMatched = true;
        if (brand) {
            isBrandMatched = product.brand === brand;
        }

        return isShowOnlySaleMatched && isDataTypeMatched && isTypeMatched && isCategoryMatched && 
               isSizeMatched && isColorMatched && isBrandMatched && isPriceRangeMatched;
    })

    // Create a copy array filtered to sort
    let sortedData = [...filteredData];

    if (sortOption === 'soldQuantityHighToLow') {
        filteredData = sortedData.sort((a, b) => b.sold - a.sold)
    }

    if (sortOption === 'discountHighToLow') {
        filteredData = sortedData
            .sort((a, b) => (
                (Math.floor(100 - ((b.price / b.originPrice) * 100))) - (Math.floor(100 - ((a.price / a.originPrice) * 100)))
            ))
    }

    if (sortOption === 'priceHighToLow') {
        filteredData = sortedData.sort((a, b) => b.price - a.price)
    }

    if (sortOption === 'priceLowToHigh') {
        filteredData = sortedData.sort((a, b) => a.price - b.price)
    }

    const totalProducts = filteredData.length
    const selectedType = type
    const selectedCategory = category
    const selectedSize = size
    const selectedColor = color
    const selectedBrand = brand

    // Provide a fallback product if no products match the filters
    if (filteredData.length === 0) {
        filteredData = [{
            id: 'no-data',
            category: 'no-data',
            type: 'no-data',
            name: 'no-data',
            gender: 'no-data',
            new: false,
            sale: false,
            rate: 0,
            price: 0,
            originPrice: 0,
            brand: 'no-data',
            sold: 0,
            quantity: 0,
            quantityPurchase: 0,
            sizes: [],
            variation: [],
            thumbImage: [],
            images: [],
            description: 'no-data',
            action: 'no-data',
            slug: 'no-data'
        }];
    }

    // Find page number base on filteredData
    const pageCount = Math.ceil(filteredData.length / productsPerPage);

    // If page number 0, set current page = 0
    if (pageCount === 0) {
        setCurrentPage(0);
    }

    // Get product data for current page
    let currentProducts: ProductType[];

    if (filteredData.length > 0) {
        currentProducts = filteredData.slice(offset, offset + productsPerPage);
    } else {
        currentProducts = []
    }

    const handlePageChange = (selected: number) => {
        setCurrentPage(selected);
    };

    const handleClearAll = () => {
        setSortOption('');
        setType(null);
        setCategory(null);
        setSize(null);
        setColor(null);
        setBrand(null);
        setPriceRange({ min: 0, max: 100 });
        setCurrentPage(0);
        router.push('/shop/default');
    };

    return (
        <>
            <div className="breadcrumb-block style-img">
                <div className="breadcrumb-main bg-linear overflow-hidden">
                    <div className="container lg:pt-[134px] pt-24 pb-10 relative">
                        <div className="main-content w-full h-full flex flex-col items-center justify-center relative z-[1]">
                            <div className="text-content">
                                <div className="heading2 text-center">
                                    {selectedCategory || selectedType || 'Shop'}
                                </div>
                                <div className="link flex items-center justify-center gap-1 caption1 mt-3">
                                    <Link href={'/'}>Homepage</Link>
                                    <Icon.CaretRight size={14} className='text-secondary2' />
                                    <div className='text-secondary2 capitalize'>
                                        {selectedCategory || selectedType || 'Shop'}
                                    </div>
                                </div>
                            </div>
                            <div className="list-tab flex flex-wrap items-center justify-center gap-y-5 gap-8 lg:mt-[70px] mt-12 overflow-hidden">
                                {categories.map((cat, index) => (
                                    <div
                                        key={index}
                                        className={`tab-item text-button-uppercase cursor-pointer has-line-before line-2px ${selectedCategory === cat.name ? 'active' : ''}`}
                                        onClick={() => handleCategory(cat.name)}
                                    >
                                        {cat.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-img absolute top-2 -right-6 max-lg:bottom-0 max-lg:top-auto w-1/3 max-lg:w-[26%] z-[0] max-sm:w-[45%]">
                            <Image
                                src={'/images/slider/bg1-1.png'}
                                width={1000}
                                height={1000}
                                alt=''
                                className=''
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="shop-product breadcrumb1 lg:py-20 md:py-14 py-10">
                <div className="container">
                    <div className="list-product-block relative">
                        <div className="filter-heading flex items-center justify-between gap-5 flex-wrap">
                            <div className="left flex has-line items-center flex-wrap gap-5">
                                <div
                                    className="filter-sidebar-btn flex items-center gap-2 cursor-pointer"
                                    onClick={handleOpenSidebar}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M4 21V14" stroke="#1F1F1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M4 10V3" stroke="#1F1F1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M12 21V12" stroke="#1F1F1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M12 8V3" stroke="#1F1F1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M20 21V16" stroke="#1F1F1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M20 12V3" stroke="#1F1F1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M1 14H7" stroke="#1F1F1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M9 8H15" stroke="#1F1F1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M17 16H23" stroke="#1F1F1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span>Filters</span>
                                </div>
                                <div className="choose-layout flex items-center gap-2">
                                    <div
                                        className={`item three-col p-2 border border-line rounded flex items-center justify-center cursor-pointer ${layoutCol === 3 ? 'active' : ''}`}
                                        onClick={() => handleLayoutCol(3)}
                                    >
                                        <div className='flex items-center gap-0.5'>
                                            <span className='w-[3px] h-4 bg-secondary2 rounded-sm'></span>
                                            <span className='w-[3px] h-4 bg-secondary2 rounded-sm'></span>
                                            <span className='w-[3px] h-4 bg-secondary2 rounded-sm'></span>
                                        </div>
                                    </div>
                                    <div
                                        className={`item four-col p-2 border border-line rounded flex items-center justify-center cursor-pointer ${layoutCol === 4 ? 'active' : ''}`}
                                        onClick={() => handleLayoutCol(4)}
                                    >
                                        <div className='flex items-center gap-0.5'>
                                            <span className='w-[3px] h-4 bg-secondary2 rounded-sm'></span>
                                            <span className='w-[3px] h-4 bg-secondary2 rounded-sm'></span>
                                            <span className='w-[3px] h-4 bg-secondary2 rounded-sm'></span>
                                            <span className='w-[3px] h-4 bg-secondary2 rounded-sm'></span>
                                        </div>
                                    </div>
                                    <div
                                        className={`item five-col p-2 border border-line rounded flex items-center justify-center cursor-pointer ${layoutCol === 5 ? 'active' : ''}`}
                                        onClick={() => handleLayoutCol(5)}
                                    >
                                        <div className='flex items-center gap-0.5'>
                                            <span className='w-[3px] h-4 bg-secondary2 rounded-sm'></span>
                                            <span className='w-[3px] h-4 bg-secondary2 rounded-sm'></span>
                                            <span className='w-[3px] h-4 bg-secondary2 rounded-sm'></span>
                                            <span className='w-[3px] h-4 bg-secondary2 rounded-sm'></span>
                                            <span className='w-[3px] h-4 bg-secondary2 rounded-sm'></span>
                                        </div>
                                    </div>
                                </div>
                                <div className="check-sale flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="filterSale"
                                        id="filter-sale"
                                        className='border-line'
                                        onChange={handleShowOnlySale}
                                    />
                                    <label htmlFor="filter-sale" className='cation1 cursor-pointer'>Show only products on sale</label>
                                </div>
                            </div>
                            <div className="right flex items-center gap-3">
                                <label htmlFor='select-filter' className="caption1 capitalize">Sort by</label>
                                <div className="select-block relative">
                                    <select
                                        id="select-filter"
                                        name="select-filter"
                                        className='caption1 py-2 pl-3 md:pr-20 pr-10 rounded-lg border border-line'
                                        onChange={(e) => { handleSortChange(e.target.value) }}
                                        defaultValue={'Sorting'}
                                    >
                                        <option value="Sorting" disabled>Sorting</option>
                                        <option value="soldQuantityHighToLow">Best Selling</option>
                                        <option value="discountHighToLow">Best Discount</option>
                                        <option value="priceHighToLow">Price High To Low</option>
                                        <option value="priceLowToHigh">Price Low To High</option>
                                    </select>
                                    <Icon.CaretDown size={12} className='absolute top-1/2 -translate-y-1/2 md:right-4 right-2' />
                                </div>
                            </div>
                        </div>

                        <div
                            className={`sidebar style-dropdown bg-white grid md:grid-cols-4 grid-cols-2 md:gap-[30px] gap-6 ${openSidebar ? 'open' : ''}`}
                        >
                            <div className="filter-type">
                                <div className="heading6">Categories</div>
                                <div className="list-type mt-4">
                                    {categories.map((cat, index) => (
                                        <div
                                            key={index}
                                            className={`item flex items-center justify-between cursor-pointer ${selectedCategory === cat.name ? 'active' : ''}`}
                                            onClick={() => handleCategory(cat.name)}
                                        >
                                            <div className='text-secondary has-line-before hover:text-black capitalize'>{cat.name}</div>
                                            <div className='text-secondary2'>
                                                ({data.filter(dataItem => dataItem.category.toLowerCase() === cat.name.toLowerCase()).length})
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Keep other filter sections as needed */}
                            
                            {/* Size filter section */}
                            <div>
                                <div className="filter-size">
                                    <div className="heading6">Size</div>
                                    <div className="list-size flex items-center flex-wrap gap-3 gap-y-4 mt-4">
                                        {
                                            ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'].map((item, index) => (
                                                <div
                                                    key={index}
                                                    className={`size-item text-button w-[44px] h-[44px] flex items-center justify-center rounded-full border border-line ${size === item ? 'active' : ''}`}
                                                    onClick={() => handleSize(item)}
                                                >
                                                    {item}
                                                </div>
                                            ))
                                        }
                                        <div
                                            className={`size-item text-button px-4 py-2 flex items-center justify-center rounded-full border border-line ${size === 'freesize' ? 'active' : ''}`}
                                            onClick={() => handleSize('freesize')}
                                        >
                                            Freesize
                                        </div>
                                    </div>
                                </div>
                                <div className="filter-price mt-8">
                                    <div className="heading6">Price Range</div>
                                    <Slider
                                        range
                                        defaultValue={[0, 100]}
                                        min={0}
                                        max={100}
                                        onChange={handlePriceChange}
                                        className='mt-5'
                                    />
                                    <div className="price-block flex items-center justify-between flex-wrap mt-4">
                                        <div className="min flex items-center gap-1">
                                            <div>Min price:</div>
                                            <div className='price-min'>$
                                                <span>{priceRange.min}</span>
                                            </div>
                                        </div>
                                        <div className="min flex items-center gap-1">
                                            <div>Max price:</div>
                                            <div className='price-max'>$
                                                <span>{priceRange.max}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Keep other filter sections as needed */}
                            
                            <div className="filter-btn flex items-center justify-center md:justify-start gap-5 md:col-span-4 col-span-2 flex-wrap mt-2">
                                <div className="clear-btn button-main bg-white text-black border border-black cursor-pointer" onClick={handleClearAll}>Clear All</div>
                            </div>
                        </div>

                        <div className="list-filtered flex items-center gap-3 flex-wrap mt-6">
                            {selectedCategory && (
                                <div className="filter-tag flex items-center gap-2 px-3 py-1.5 bg-surface rounded-full">
                                    <div>Category: {selectedCategory}</div>
                                    <Icon.X
                                        size={14}
                                        className='cursor-pointer'
                                        onClick={() => handleCategory(selectedCategory)}
                                    />
                                </div>
                            )}
                            {/* Keep other filter tags as needed */}
                        </div>

                        <div className="list-product mt-10">
                            <div className="heading flex items-center justify-between flex-wrap gap-5 pb-6">
                                <div className="left">
                                    <div className="text-caption1 text-secondary">Showing {currentProducts.length} of {totalProducts} Products</div>
                                </div>
                            </div>
                            <div className={`list-product-block grid lg:grid-cols-${layoutCol} grid-cols-2 md:gap-[30px] gap-3`}>
                                {currentProducts.map((item) => (
                                    item.id === 'no-data' ? (
                                        <div key={item.id} className="no-data-product col-span-full text-center py-12">
                                            <div className="text-button-uppercase">No products match the selected criteria</div>
                                        </div>
                                    ) : (
                                        <Product key={item.id} data={item} type='grid' />
                                    )
                                ))}
                            </div>
                            <div className="pagination-block flex justify-center md:mt-10 mt-7">
                                <HandlePagination
                                    pageCount={pageCount}
                                    onPageChange={handlePageChange}
                                    currentPage={currentPage}
                                    previousLabel={'Previous'}
                                    nextLabel={'Next'}
                                    containerClassName={'pagination-container flex flex-wrap items-center gap-2'}
                                    pageClassName={'pagination-item flex items-center justify-center text-button w-8 h-8 rounded-full'}
                                    activeClassName={'active'}
                                    previousClassName={'pagination-item flex items-center justify-center text-button px-3 h-8 rounded-full'}
                                    nextClassName={'pagination-item flex items-center justify-center text-button px-3 h-8 rounded-full'}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ShopBreadCrumbImg