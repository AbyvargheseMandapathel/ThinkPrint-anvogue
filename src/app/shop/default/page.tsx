'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import Menu from '@/components/Header/Menu/Menu'
import ShopBreadCrumbImg from '@/components/Shop/ShopBreadCrumbImg'
import Footer from '@/components/Footer/Footer'
import { ProductType, CategoryType } from '@/type/ProductType'

export default function Default() {
    const searchParams = useSearchParams()
    const type = searchParams.get('type') // e.g., "Gadgets"
    const category = searchParams.get('category')

    const [products, setProducts] = useState<ProductType[]>([])
    const [categories, setCategories] = useState<CategoryType[]>([])
    const [loading, setLoading] = useState(true)

    // Fetch products and categories
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch products
                const productsRes = await fetch('/api/products-api') 
                const productsData = await productsRes.json()

                let formattedProducts: ProductType[] = []

                if (productsData.success && Array.isArray(productsData.data)) {
                    formattedProducts = productsData.data.map((item: any) => ({
                        id: item.id.toString(),
                        name: item.title,
                        price: item.price || 0,
                        originPrice: item.price || 0,
                        sale: false,
                        new: false,
                        image: item.image,
                        description: item.short_description || '',
                        category: item.category_name,
                        type: item.subcategory_name.toLowerCase().replace(/\s+/g, '-'),
                        gender: '', // placeholder if not available
                        brand: '',
                        sold: 0,
                        quantity: 1,
                        quantityPurchase: 0,
                        sizes: [],
                        variation: [],
                        images: [item.image],
                        action: '',
                        slug: ''
                    }))
                }

                // Fetch categories
                const categoriesRes = await fetch('/api/categories-api') 
                const categoriesData = await categoriesRes.json()

                if (categoriesData.success && Array.isArray(categoriesData.data)) {
                    setCategories(categoriesData.data)
                }

                // Set all products
                setProducts(formattedProducts)
            } catch (error) {
                console.error("Error fetching data:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    // Apply filter when `type` changes
    const filteredProducts = type
        ? products.filter(p => p.type === type.toLowerCase().replace(/\s+/g, '-'))
        : products

    if (loading) {
        return (
            <div className="loading-container flex items-center justify-center h-screen">
                <div className="loading-spinner">Loading...</div>
            </div>
        )
    }

    return (
        <>
            <TopNavOne props="style-one bg-black" slogan="🎉 Free Shipping on Bulk Orders" />
            <div id="header" className='relative w-full'>
                <Menu props="bg-transparent" />
            </div>
            <ShopBreadCrumbImg
                data={filteredProducts}
                productPerPage={12}
                dataType={type || ''}
                categories={categories}
                categoryFilter={category}
            />
            <Footer />
        </>
    )
}