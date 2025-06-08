'use client'
import React, { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import MenuOne from '@/components/Header/Menu/MenuOne'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import Footer from '@/components/Footer/Footer'
import Product from '@/components/Product/Product'
import HandlePagination from '@/components/Other/HandlePagination'
import * as Icon from "@phosphor-icons/react/dist/ssr"

interface ProductApiType {
  id: number;
  title: string;
  short_description: string;
  image?: string;
  category_name: string;
}

export default function SearchResult() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const query = searchParams?.get('query') || ''

  const [searchKeyword, setSearchKeyword] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [filteredData, setFilteredData] = useState<ProductApiType[]>([])
  const [loading, setLoading] = useState(true)

  const productsPerPage = 8
  const offset = currentPage * productsPerPage

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const url = 'https://www.thinkprint.shop/api/products-api' 
        const res = await fetch(`${url}?search=${encodeURIComponent(query)}`)

        if (!res.ok) throw new Error('Failed to fetch products')

        const json = await res.json()

        let productList: ProductApiType[] = []

        if (json?.success && Array.isArray(json.data)) {
          productList = json.data.map((item: any) => ({
            id: item.id,
            title: item.title,
            short_description: item.short_description,
            image: item.image,
            category_name: item.category_name
          }))
        }

        // Filter by title OR category name
        const filtered = productList.filter((item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.category_name.toLowerCase().includes(query.toLowerCase())
        )

        setFilteredData(filtered)
      } catch (error) {
        console.error("Error fetching products:", error)
        setFilteredData([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [query])

  const pageCount = Math.ceil((filteredData.length || 0) / productsPerPage)
  const currentProducts = filteredData.slice(offset, offset + productsPerPage)

  const handleSearch = (value: string) => {
    if (!value.trim()) return
    router.push(`/search-result?query=${encodeURIComponent(value)}`)
  }

  const handlePageChange = (selected: number) => {
    setCurrentPage(selected)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <TopNavOne props="style-one bg-black" slogan="New customers save 10% with the code GET10" />
      <div id="header" className='relative w-full'>
        <MenuOne props="bg-transparent" />
        <Breadcrumb heading='Search Result' subHeading='Search Result' />
      </div>
      <div className="shop-product breadcrumb1 lg:py-20 md:py-14 py-10">
        <div className="container">
          <div className="heading flex flex-col items-center">
            {query && (
              <div className="heading4 text-center">
                Found {filteredData.length} results for "{query}"
              </div>
            )}
            <div className="input-block lg:w-1/2 sm:w-3/5 w-full md:h-[52px] h-[44px] sm:mt-8 mt-5">
              <div className='w-full h-full relative'>
                <input
                  type="text"
                  placeholder='Search...'
                  className='caption1 w-full h-full pl-4 md:pr-[150px] pr-32 rounded-xl border border-line'
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchKeyword)}
                />
                <button
                  className='button-main absolute top-1 bottom-1 right-1 flex items-center justify-center'
                  onClick={() => handleSearch(searchKeyword)}
                >
                  <Icon.MagnifyingGlass size={20} />
                </button>
              </div>
            </div>
          </div>

          <div className="list-product-block relative md:pt-10 pt-6">
            {query && <div className="heading6">Product Search: "{query}"</div>}
            <div className="list-product grid lg:grid-cols-4 sm:grid-cols-3 grid-cols-2 sm:gap-[30px] gap-[20px] mt-5">
              {loading ? (
                <div className="col-span-full text-center py-6 text-gray-500">
                  Loading products...
                </div>
              ) : !query ? (
                <div className="col-span-full text-center py-6 text-gray-500">
                  Please enter a search term
                </div>
              ) : currentProducts.length === 0 ? (
                <div className="col-span-full text-center py-6 text-gray-500">
                  No products match the selected criteria.
                </div>
              ) : (
                currentProducts.map((item) => (
                  <Product key={item.id} data={item} />
                ))
              )}
            </div>

            {pageCount > 1 && (
              <div className="list-pagination flex items-center justify-center md:mt-10 mt-7">
                <HandlePagination pageCount={pageCount} onPageChange={handlePageChange} />
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}