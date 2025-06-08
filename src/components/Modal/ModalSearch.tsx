'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import * as Icon from "@phosphor-icons/react/dist/ssr";
import Product from '../Product/Product';
import { useModalSearchContext } from '@/context/ModalSearchContext'

const ModalSearch = () => {
    const { isModalOpen, closeModalSearch } = useModalSearchContext();
    const [searchKeyword, setSearchKeyword] = useState('');
    const [trendingProducts, setTrendingProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter()

    // Fetch products from API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch('https://www.thinkprint.shop/api/products-api')
                const productsData = await res.json()
                
                if (productsData.success && Array.isArray(productsData.data)) {
                    // Get the first 4 products
                    const firstFourProducts = productsData.data.slice(0, 4).map((item: any) => ({
                        id: item.id.toString(),
                        name: item.title,
                        description: item.short_description || '',
                        image: item.image,
                        sale: item.sale || false,
                        new: item.new || false
                    }))
                    setTrendingProducts(firstFourProducts)
                }
            } catch (error) {
                console.error('Failed to fetch products:', error)
            } finally {
                setLoading(false)
            }
        }

        if (isModalOpen) {
            fetchProducts()
        }
    }, [isModalOpen])

    const handleSearch = (value: string) => {
        router.push(`/search-result?query=${value}`)
        closeModalSearch()
        setSearchKeyword('')
    }

    return (
        <>
            <div className={`modal-search-block`} onClick={closeModalSearch}>
                <div
                    className={`modal-search-main md:p-10 p-6 rounded-[32px] ${isModalOpen ? 'open' : ''}`}
                    onClick={(e) => { e.stopPropagation() }}
                >
                    <div className="form-search relative">
                        <Icon.MagnifyingGlass
                            className='absolute heading5 right-6 top-1/2 -translate-y-1/2 cursor-pointer'
                            onClick={() => {
                                handleSearch(searchKeyword)
                            }}
                        />
                        <input
                            type="text"
                            placeholder='Searching...'
                            className='text-button-lg h-14 rounded-2xl border border-line w-full pl-6 pr-12'
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchKeyword)}
                        />
                    </div>
                    <div className="list-recent mt-8">
                        <div className="heading6">Trending</div>
                        {loading ? (
                            <div className="text-center py-4">Loading trending products...</div>
                        ) : (
                            <div className="list-product pb-5 hide-product-sold grid xl:grid-cols-4 sm:grid-cols-2 gap-7 mt-4">
                                {trendingProducts.map((product) => (
                                    <Product key={product.id} data={product} type='grid' />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default ModalSearch