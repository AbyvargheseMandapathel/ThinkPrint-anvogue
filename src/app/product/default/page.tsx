'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import Menu from '@/components/Header/Menu/Menu'
import BreadcrumbProduct from '@/components/Breadcrumb/BreadcrumbProduct'
import Default from '@/components/Product/Detail/Default'
import Footer from '@/components/Footer/Footer'
import { ProductType } from '@/type/ProductType'

const ProductDefault = () => {
  const searchParams = useSearchParams()
  const productId = searchParams.get('id') || '1'

  const [data, setData] = useState<ProductType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch products from external API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`https://www.thinkprint.shop/api/products-api/`) 
        if (!res.ok) throw new Error('Failed to fetch products')

        const result = await res.json()

        // Log the full raw API response data for debugging
        console.log('Full API response:', result)

        // Ensure result.data exists and is an array
        if (!Array.isArray(result.data)) {
          throw new Error('API did not return an array in .data')
        }

        // Normalize products to match ProductType
        const formattedProducts: ProductType[] = result.data.map((item: any) => ({
          id: item.id.toString(),
          name: item.title,
          price: item.price || 0,
          originPrice: item.original_price || item.price || 0,
          sale: item.sale ? Boolean(item.sale) : false,
          new: item.new ? Boolean(item.new) : true,
          description: item.long_description || item.short_description || 'No description available.',
          category: item.category_name || 'Uncategorized',
          type: item.subcategory_name || item.category_name?.toLowerCase().replace(/\s+/g, '-') || 'default',
          gender: 'unisex',
          brand: item.is_urbangear ? 'UrbanGear' : 'Unknown',
          sold: item.sold_count || 0,
          quantity: item.stock || 100,
          design: item.design_specifications || {},
          quantityPurchase: 1,
          sizes: [],
          variation: [],
          images: [item.image || '/images/no-image.png'],
          images: [item.image || '/images/no-image.png'],
          action: 'Add to Cart',
          slug: item.title.toLowerCase().replace(/\s+/g, '-') + '-' + item.id,
          rate: item.rate || 4.5
        }))

        setData(formattedProducts)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const selectedProduct = data.find(p => String(p.id) === String(productId))

  return (
    <>
      <TopNavOne props="style-one bg-black" slogan="🎉 Free Shipping on Bulk Orders" />
      <div id="header" className="relative w-full">
        <Menu props="bg-white" />
        <BreadcrumbProduct data={data} productPage="default" productId={productId} />
      </div>

      {/* Loading */}
      {loading && <div className="text-center py-10">Loading product...</div>}

      {/* Error */}
      {error && <div className="text-center text-red-500 py-10">Error: {error}</div>}

      {/* Success: Render product detail */}
      {!loading && !error && selectedProduct && <Default data={[selectedProduct]} productId={productId} />}

      {/* Not found */}
      {!loading && !error && !selectedProduct && <div className="text-center py-10">Product not found</div>}

      <Footer />
    </>
  )
}

export default ProductDefault