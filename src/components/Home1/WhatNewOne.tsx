'use client'
import React, { useState, useEffect } from 'react'
import Product from '../Product/Product'
import { motion } from 'framer-motion'

// Define ProductType based on your interface
import { ProductType } from '@/type/ProductType'

interface Props {
  data: ProductType[]
  start: number
  limit: number
}

const WhatNewOne: React.FC<Props> = ({ data, start, limit }) => {
  const [activeTab, setActiveTab] = useState<string>('all')
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([])

  // Fetch categories for tabs
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

  const handleTabClick = (type: string) => {
    setActiveTab(type.toLowerCase())
  }

  const tabs = ['ALL', ...categories.map(cat => cat.name)]

  const filteredProducts = activeTab === 'all'
    ? data.filter(product => product.category === 'fashion')
    : data.filter(
        product =>
          product.category === 'fashion' &&
          product.type.toLowerCase() === activeTab
      )

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
            <Product key={prd.id} data={prd} type='grid' style='style-1' />
          ))}
        </div>
      </div>
    </div>
  )
}

export default WhatNewOne