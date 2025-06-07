'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation';
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import MenuOne from '@/components/Header/Menu/MenuOne'
import ShopBreadCrumbImg from '@/components/Shop/ShopBreadCrumbImg';
import Footer from '@/components/Footer/Footer'
import { ProductType, CategoryType } from '@/type/ProductType'
import Menu from '@/components/Header/Menu/Menu'

export default function Default() {
    const searchParams = useSearchParams()
    const type = searchParams.get('type')
    const category = searchParams.get('category')
    const [products, setProducts] = useState<ProductType[]>([])
    const [categories, setCategories] = useState<CategoryType[]>([])
    const [loading, setLoading] = useState(true)

    // Fetch products and categories
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch products
                const productsRes = await fetch('https://www.thinkprint.shop/api/products-api')
                const productsData = await productsRes.json()
                
                if (productsData.success && Array.isArray(productsData.data)) {
                    // Map API data to ProductType format
                    const formattedProducts = productsData.data.map((item: any) => ({
                        id: item.id.toString(),
                        name: item.title,
                        price: item.price || 0,
                        originPrice: item.price || 0, // Using price as originPrice if not provided
                        sale: false,
                        new: false,
                        image: item.image,
                        description: item.short_description || '',
                        category: item.category_name,
                        type: item.category_name.toLowerCase().replace(/\s+/g, '-'),
                        // Adding required properties for compatibility
                        gender: '',
                        brand: '',
                        sold: 0,
                        quantity: 1,
                        quantityPurchase: 0,
                        sizes: [],
                        variation: [],
                        images: [item.image],
                        images: [item.image],
                        action: '',
                        slug: ''
                    }))
                    setProducts(formattedProducts)
                }
                
                // Fetch categories
                const categoriesRes = await fetch('https://www.thinkprint.shop/api/categories-api')
                const categoriesData = await categoriesRes.json()
                
                if (categoriesData.success && Array.isArray(categoriesData.data)) {
                    setCategories(categoriesData.data)
                }
            } catch (error) {
                console.error("Error fetching data:", error)
            } finally {
                setLoading(false)
            }
        }
        
        fetchData()
    }, [])

    if (loading) {
        return <div className="loading-container flex items-center justify-center h-screen">
            <div className="loading-spinner">Loading...</div>
        </div>
    }

    return (
        <>
            <TopNavOne props="style-one bg-black" slogan="🎉 Free Shipping on Bulk Orders" />
            <div id="header" className='relative w-full'>
            <Menu props="bg-transparent" />
            </div>
            <ShopBreadCrumbImg 
                data={products} 
                productPerPage={12} 
                dataType={type} 
                categories={categories}
                categoryFilter={category}
            />
            <Footer />
        </>
    )
}
