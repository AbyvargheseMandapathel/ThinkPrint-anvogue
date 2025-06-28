'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import Menu from '@/components/Header/Menu/Menu'
import ShopBreadCrumbImg from '@/components/Shop/ShopBreadCrumbImg'
import Footer from '@/components/Footer/Footer'
import { ProductType, CategoryType } from '@/type/ProductType'

export default function Default() {
    const searchParams = useSearchParams()
    const router = useRouter()

    const [products, setProducts] = useState<ProductType[]>([])
    const [categories, setCategories] = useState<CategoryType[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const type = searchParams.get('type')?.toLowerCase().replace(/\s+/g, '-') || null
    const category = searchParams.get('category')?.toLowerCase().replace(/\s+/g, '-') || null

    // Fetch data once on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                setError(null)

                // Fetch products
                const productsRes = await fetch('/api/products-api')
                if (!productsRes.ok) throw new Error("Failed to fetch products")
                const productsData = await productsRes.json()

                const formattedProducts: ProductType[] = productsData.success && Array.isArray(productsData.data)
                    ? productsData.data.map((item: any) => ({
                        id: item.id.toString(),
                        name: item.title,
                        price: item.price || 0,
                        originPrice: item.price || 0,
                        sale: false,
                        new: false,
                        image: item.image,
                        description: item.short_description || '',
                        category: item.category_name ? item.category_name.toLowerCase().replace(/\s+/g, '-') : null,
                        type: item.subcategory_name ? item.subcategory_name.toLowerCase().replace(/\s+/g, '-') : null,
                        brand: '',  // Placeholder
                        sold: 0,
                        quantity: 1,
                        quantityPurchase: 0,
                        sizes: [],
                        variation: [],
                        images: [item.image],
                        action: '',
                        slug: ''
                    }))
                    : []

                // Fetch categories
                const categoriesRes = await fetch('/api/categories-api')
                if (!categoriesRes.ok) throw new Error("Failed to fetch categories")
                const categoriesData = await categoriesRes.json()

                const formattedCategories: CategoryType[] = categoriesData.success && Array.isArray(categoriesData.data)
                    ? categoriesData.data
                    : []

                setProducts(formattedProducts)
                setCategories(formattedCategories)
            } catch (err: any) {
                setError(err.message || "An error occurred while fetching data.")
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, []) // Run only once on mount

    // Filter products based on query params
    const filteredProducts = useMemo(() => {
        if (!products.length) return []

        // Both category and type present
        if (category && type) {
            return products.filter(
                p => p.category === category && p.type === type
            )
        }
        // Only category present
        if (category) {
            return products.filter(
                p => p.category === category
            )
        }
        // Only type present
        if (type) {
            return products.filter(
                p => p.type === type
            )
        }
        // Neither present, return all
        return products
    }, [products, category, type])

    if (loading) {
        return (
            <div className="loading-container flex items-center justify-center h-screen">
                <div className="loading-spinner">Loading...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="error-message text-red-600 text-center p-8">
                <p>{error}</p>
                <button
                    onClick={() => router.refresh()}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Retry
                </button>
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