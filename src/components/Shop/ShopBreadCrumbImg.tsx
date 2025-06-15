'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import * as Icon from '@phosphor-icons/react/dist/ssr'
import { ProductType, CategoryType } from '@/type/ProductType'
import Product from '../Product/Product'
import HandlePagination from '../Other/HandlePagination'
import { useRouter, useSearchParams } from 'next/navigation'

interface Props {
  data: Array<ProductType>
  productPerPage: number
  dataType: string | null
  categories?: CategoryType[]
  categoryFilter?: string | null
}

const ShopBreadCrumbImg: React.FC<Props> = ({
  data,
  productPerPage,
  dataType,
  categories = [],
  categoryFilter,
}) => {
  const router = useRouter()
  const [layoutCol, setLayoutCol] = useState<number>(4)
  const [showOnlySale, setShowOnlySale] = useState(false)
  const [sortOption, setSortOption] = useState<string | null>(null)
  const [openSidebar, setOpenSidebar] = useState(false)
  const [type, setType] = useState<string | null>(dataType)
  const [category, setCategory] = useState<string | null>(categoryFilter)
  const [currentPage, setCurrentPage] = useState(0)

  // Set category from URL parameter
  useEffect(() => {
    setCategory(categoryFilter)
  }, [categoryFilter])

  const handleLayoutCol = (col: number) => setLayoutCol(col)
  const handleShowOnlySale = () => {
    setShowOnlySale((toggleSelect) => !toggleSelect)
    setCurrentPage(0)
  }
  const handleOpenSidebar = () => {
    setOpenSidebar((toggleOpen) => !toggleOpen)
    setCurrentPage(0)
  }

  const handleType = (type: string) => {
    setType((prevType) => (prevType === type ? null : type))
    setCurrentPage(0)
    router.push(`/shop/default?type=${type}`)
  }

  const handleCategory = (categoryName: string | null) => {
    if (categoryName === null) {
      setCategory(null)
      router.push('/shop/default')
    } else {
      setCategory((prevCategory) =>
        prevCategory === categoryName ? null : categoryName
      )
      router.push(`/shop/default?category=${encodeURIComponent(categoryName)}`)
    }
    setCurrentPage(0)
  }

  const handleSortChange = (option: string) => {
    setSortOption(option)
    setCurrentPage(0)
  }

  // Filter logic
  let filteredData = data.filter((product) => {
    const isShowOnlySaleMatched = showOnlySale ? product.sale : true
    const isDataTypeMatched = dataType ? product.type === dataType : true
    const isTypeMatched = type ? product.type === type : true
    const isCategoryMatched = category ? product.category.toLowerCase() === category.toLowerCase() : true
    return isShowOnlySaleMatched && isDataTypeMatched && isTypeMatched && isCategoryMatched
  })

  // Sort logic - categories or subcategories
  if (sortOption) {
    if (sortOption === 'ALL') {
      filteredData.sort((a, b) => a.category.localeCompare(b.category))
    } else {
      filteredData.sort((a, b) => {
        if (!a.subcategory || !b.subcategory) return 0
        return a.subcategory.localeCompare(b.subcategory)
      })
    }
  }

  const totalProducts = filteredData.length
  const pageCount = Math.ceil(totalProducts / productPerPage)
  const offset = currentPage * productPerPage
  const currentProducts = filteredData.slice(offset, offset + productPerPage)

  // Fallback for empty results
  const displayProducts =
    filteredData.length > 0
      ? currentProducts
      : [
          {
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
            images: [],
            images: [],
            description: 'no-data',
            action: 'no-data',
            slug: 'no-data',
          },
        ]

  const handlePageChange = (selected: number) => {
    setCurrentPage(selected)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleClearAll = () => {
    setType(null)
    setCategory(null)
    setShowOnlySale(false)
    setSortOption(null)
    setCurrentPage(0)
    router.push('/shop/default')
  }

  return (
    <>
      {/* Breadcrumb Section */}
      <div className="breadcrumb-block style-img">
        <div className="breadcrumb-main bg-linear overflow-hidden">
          <div className="container lg:pt-[134px] pt-24 pb-10 relative">
            <div className="main-content w-full h-full flex flex-col items-center justify-center relative z-[1]">
              <div className="text-content">
                <div className="heading2 text-center">{category || type || 'Shop'}</div>
                <div className="link flex items-center justify-center gap-1 caption1 mt-3">
                  <Link href="/">Homepage</Link>
                  <Icon.CaretRight size={14} className="text-secondary2" />
                  <div className="text-secondary2 capitalize">{category || type || 'Shop'}</div>
                </div>
              </div>

              {/* Tabs with ALL at start only */}
              <div className="list-tab flex flex-wrap items-center justify-center gap-y-5 gap-8 lg:mt-[70px] mt-12 overflow-hidden">
                <div
                  key="all-start"
                  className={`tab-item text-button-uppercase cursor-pointer has-line-before line-2px ${!category ? 'active' : ''}`}
                  onClick={() => handleCategory(null)}
                >
                  ALL
                </div>
                {categories.map((cat, index) => (
                  <div
                    key={index}
                    className={`tab-item text-button-uppercase cursor-pointer has-line-before line-2px ${
                      category === cat.name ? 'active' : ''
                    }`}
                    onClick={() => handleCategory(cat.name)}
                  >
                    {cat.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Background image */}
            <div className="bg-img absolute top-2 -right-6 max-lg:bottom-0 max-lg:top-auto w-1/3 max-lg:w-[26%] z-[0] max-sm:w-[45%]">
              <Image src="https://anvogue.vercel.app/_next/image?url=%2Fimages%2Fslider%2Fbg1-1.png&w=2048&q=75" width={1000} height={1000} alt="" />
            </div>
          </div>
        </div>
      </div>

      {/* Shop Content */}
      <div className="shop-product breadcrumb1 lg:py-20 md:py-14 py-10">
        <div className="container">
          <div className="list-product-block relative">
            {/* Filter Heading */}
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

                {/* Layout buttons */}
                <div className="choose-layout flex items-center gap-2">
                  {[3, 4, 5].map((col) => (
                    <div
                      key={col}
                      className={`item p-2 border border-line rounded flex items-center justify-center cursor-pointer ${
                        layoutCol === col ? 'active' : ''
                      }`}
                      onClick={() => handleLayoutCol(col)}
                    >
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: col }).map((_, i) => (
                          <span key={i} className="w-[3px] h-4 bg-secondary2 rounded-sm"></span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Show Sale Only Checkbox */}
                <div className="check-sale flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="filterSale"
                    id="filter-sale"
                    className="border-line"
                    onChange={handleShowOnlySale}
                  />
                  <label htmlFor="filter-sale" className="caption1 cursor-pointer">
                    Show only products on sale
                  </label>
                </div>
              </div>

              {/* Sorting Dropdown */}
              <div className="right flex items-center gap-3">
                <label htmlFor="select-sort" className="caption1 capitalize">
                  Sort by
                </label>
                <div className="select-block relative">
                  <select
                    id="select-sort"
                    name="select-sort"
                    className="caption1 py-2 pl-3 md:pr-20 pr-10 rounded-lg border border-line"
                    onChange={(e) => handleSortChange(e.target.value)}
                    defaultValue={sortOption || 'ALL'}
                  >
                    <option value="ALL">All Products</option>
                    {sortOption === 'ALL'
                      ? categories.map((cat, idx) => (
                          <option key={idx} value={cat.name}>
                            {cat.name}
                          </option>
                        ))
                      : Array.from(new Set(filteredData.map((p) => p.subcategory))).map((subcat, idx) => (
                          <option key={idx} value={subcat || 'Uncategorized'}>
                            {subcat || 'Uncategorized'}
                          </option>
                        ))}
                  </select>
                  <Icon.CaretDown
                    size={12}
                    className="absolute top-1/2 -translate-y-1/2 md:right-4 right-2"
                  />
                </div>
              </div>
            </div>

            {/* Sidebar Filters */}
            <div
              className={`sidebar style-dropdown bg-white grid md:grid-cols-4 grid-cols-2 md:gap-[30px] gap-6 z-10 ${
                openSidebar ? 'open' : ''
              }`}
            >
              <div className="filter-type">
                <div className="heading6">Categories</div>
                <div className="list-type mt-4">
                  {categories.map((cat, index) => (
                    <div
                      key={index}
                      className={`item flex items-center justify-between cursor-pointer ${
                        category === cat.name ? 'active' : ''
                      }`}
                      onClick={() => handleCategory(cat.name)}
                    >
                      <div className="text-secondary has-line-before hover:text-black capitalize">
                        {cat.name}
                      </div>
                      <div className="text-secondary2">
                        ({data.filter((d) => d.category.toLowerCase() === cat.name.toLowerCase()).length})
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Filter Tags */}
            <div className="list-filtered flex items-center gap-3 flex-wrap mt-6">
              {category && (
                <div className="filter-tag flex items-center gap-2 px-3 py-1.5 bg-surface rounded-full">
                  <div>Category: {category}</div>
                  <Icon.X size={14} className="cursor-pointer" onClick={() => handleCategory(null)} />
                </div>
              )}
            </div>

            {/* Product Grid */}
            <div className="list-product mt-10">
              <div className="heading flex items-center justify-between flex-wrap gap-5 pb-6">
                <div className="left">
                  <div className="text-caption1 text-secondary">
                    Showing {displayProducts.length} of {totalProducts} Products
                  </div>
                </div>
              </div>

              <div
                className={`list-product-block grid lg:grid-cols-${layoutCol} grid-cols-2 md:gap-[30px] gap-3`}
              >
                {displayProducts.map((item) =>
                  item.id === 'no-data' ? (
                    <div key={item.id} className="no-data-product col-span-full text-center py-12">
                      <div className="text-button-uppercase">No products match the selected criteria</div>
                    </div>
                  ) : (
                    <Product key={item.id} data={item} type="grid" />
                  )
                )}
              </div>

              {/* Pagination */}
              {pageCount > 1 && (
                <div className="list-pagination flex items-center justify-center md:mt-10 mt-7">
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
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ShopBreadCrumbImg