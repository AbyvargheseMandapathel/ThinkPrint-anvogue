'use client'
import React, { useEffect, useState } from 'react'
import Product from '../Product/Product'
import { motion } from 'framer-motion'
import { ProductType, CategoryType } from '@/type/ProductType'

// 👇 Define props interface
interface Props {
  data: any[] // Change to any[] to accept the raw product data
  start: number
  limit: number
}

// 👇 Add props typing
const WhatNewOne: React.FC<Props> = ({ data, start, limit }) => {
  const [products, setProducts] = useState<ProductType[]>([])
  const [categories, setCategories] = useState<CategoryType[]>([])
  const [activeTab, setActiveTab] = useState<string>('all')
  const [loading, setLoading] = useState<boolean>(true)

  // Map the raw product data to match ProductType
  const mappedData = data.map(product => ({
    id: product.id,
    name: product.name,
    price: product.price,
    originPrice: product.originPrice,
    sale: product.sale,
    new: product.new,
    image: product.images?.[0] || product.images?.[0] || "/images/product/1000x1000.png",
    description: product.description,
    category: product.category,
    type: product.type
  })) as ProductType[]

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('https://www.thinkprint.shop/api/categories-api') 
        const result = await res.json()
        if (result.success && Array.isArray(result.data)) {
          setCategories(result.data.slice(0, 4))
        }
      } catch (error) {
        console.error("Error fetching categories:", error)
      }
    }

    fetchCategories()
  }, [])

  // Use API products + static fallback
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('https://www.thinkprint.shop/api/products-api') 
        const result = await res.json()

        if (result.success && Array.isArray(result.data)) {
          const formattedProducts = result.data.map((item: { 
            id: number;
            title: string;
            price: number;
            origin_price?: number;
            sale?: boolean;
            new?: boolean;
            image: string;
            short_description?: string;
            category_name: string;
          }) => ({
            id: item.id.toString(),
            name: item.title,
            price: item.price,
            originPrice: item.origin_price || item.price,
            sale: item.sale || false,
            new: item.new || false,
            image: item.image,
            description: item.short_description || '',
            category: 'fashion',
            type: item.category_name.toLowerCase().replace(/\s+/g, '-'),
          }))
          setProducts(formattedProducts)
        }
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleTabClick = (type: string) => {
    setActiveTab(type.toLowerCase())
  }

  const tabs = ['ALL', ...categories.map(cat => cat.name)]

  // Updated filtering logic to properly match category names with product types
  const filteredProducts = activeTab === 'all'
    ? [...products, ...mappedData] // use both API and mapped static data
    : [...products, ...mappedData].filter(product => {
        // Convert both to lowercase and normalize for comparison
        const normalizedType = product.type.toLowerCase().replace(/\s+/g, '-')
        const normalizedActiveTab = activeTab.toLowerCase().replace(/\s+/g, '-')
        
        // Check if the product type matches the active tab
        return normalizedType === normalizedActiveTab ||
               // Also check if the category matches (for backward compatibility)
               product.category.toLowerCase() === activeTab.toLowerCase()
      })

  if (loading) {
    return <div className="text-center py-10">Loading...</div>
  }

  return (
    <div className="whate-new-block md:pt-20 pt-10">
      <div className="container mx-auto">
        <div className="heading flex flex-col items-center text-center">
        <div className="heading3">What{String.raw`'s`} new</div>
        </div>

        <div className="menu-tab flex items-center gap-2 p-1 bg-surface rounded-2xl mt-6 justify-center">
          {tabs.map((type) => (
            <div
              key={type}
              className={`tab-item relative text-secondary text-button-uppercase py-2 px-5 cursor-pointer duration-500 hover:text-black ${activeTab === type.toLowerCase() ? 'active' : ''}`}
              onClick={() => handleTabClick(type)}
            >
              {activeTab === type.toLowerCase() && (
                <motion.div layoutId='active-pill' className='absolute inset-0 rounded-2xl bg-white'></motion.div>
              )}
              <span className='relative text-button-uppercase z-[1]'>
                {type === 'ALL' ? 'All' : type}
              </span>
            </div>
          ))}
        </div>

        <div className="list-product grid lg:grid-cols-4 sm:grid-cols-2 gap-6 md:mt-10 mt-6">
  {filteredProducts.slice(start, limit).map((prd) => (
    <Product key={prd.id} data={prd} />
  ))}
</div>
      </div>
    </div>
  )
}

export default WhatNewOne