'use client'
import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import Menu from '@/components/Header/Menu/Menu'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import Footer from '@/components/Footer/Footer'
import { ProductType } from '@/type/ProductType'
import Product from '@/components/Product/Product'
import HandlePagination from '@/components/Other/HandlePagination'
import * as Icon from "@phosphor-icons/react/dist/ssr";

const SearchResult = () => {
    const [searchKeyword, setSearchKeyword] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(0);
    const [products, setProducts] = useState<ProductType[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<ProductType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const productsPerPage = 8;
    const offset = currentPage * productsPerPage;
    
    const router = useRouter()
    const searchParams = useSearchParams()
    let query = searchParams.get('query') as string

    // Fetch products from API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const res = await fetch('https://www.thinkprint.shop/api/products-api')
                if (!res.ok) throw new Error('Failed to fetch products')
                
                const productsData = await res.json()
                
                if (productsData.success && Array.isArray(productsData.data)) {
                    // Map API data to ProductType format
                    const formattedProducts = productsData.data.map((item: any) => ({
                        id: item.id.toString(),
                        name: item.title,
                        price: item.price || 0,
                        originPrice: item.original_price || item.price || 0,
                        sale: item.sale ? Boolean(item.sale) : false,
                        new: item.new ? Boolean(item.new) : true,
                        image: item.image,
                        description: item.short_description || '',
                        category: item.category_name || 'Uncategorized',
                        type: item.category_name?.toLowerCase().replace(/\s+/g, '-') || 'default',
                        gender: 'unisex',
                        brand: '',
                        sold: 0,
                        quantity: 1,
                        quantityPurchase: 0,
                        sizes: [],
                        variation: [],
                        images: [item.image],
                        action: '',
                        slug: ''
                    }));
                    setProducts(formattedProducts);
                } else {
                    throw new Error('Invalid data format from API');
                }
            } catch (err: any) {
                console.error('Error fetching products:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Filter products based on search query
    useEffect(() => {
        if (!query) {
            setFilteredProducts(products);
            return;
        }

        const filtered = products.filter((product) =>
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.type.toLowerCase().includes(query.toLowerCase()) ||
            product.description.toLowerCase().includes(query.toLowerCase())
        );

        setFilteredProducts(filtered);
        setCurrentPage(0); // Reset to first page when search query changes
    }, [query, products]);

    const handleSearch = (value: string) => {
        router.push(`/search-result?query=${value}`)
        setSearchKeyword('')
    }

    // Create a placeholder product for "no results" case
    const noDataProduct = {
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
        description: 'no-data',
        action: 'no-data',
        slug: 'no-data'
    };

    // Determine which products to display
    let displayProducts = filteredProducts;
    if (filteredProducts.length === 0 && !loading) {
        displayProducts = [noDataProduct];
    }

    // Calculate pagination
    const pageCount = Math.ceil(displayProducts.length / productsPerPage);
    const currentProducts = displayProducts.slice(offset, offset + productsPerPage);

    const handlePageChange = (selected: number) => {
        setCurrentPage(selected);
    };

    return (
        <>
            <TopNavOne props="style-one bg-black" slogan="New customers save 10% with the code GET10" />
            <div id="header" className='relative w-full'>
                <Menu props="bg-transparent" />
                <Breadcrumb heading='Search Result' subHeading='Search Result' />
            </div>
            <div className="shop-product breadcrumb1 lg:py-20 md:py-14 py-10">
                <div className="container">
                    <div className="heading flex flex-col items-center">
                        {loading ? (
                            <div className="heading4 text-center">Searching products...</div>
                        ) : error ? (
                            <div className="heading4 text-center text-red-500">Error: {error}</div>
                        ) : (
                            <div className="heading4 text-center">
                                Found {filteredProducts.length} results for {String.raw`"`}{query || 'all products'}{String.raw`"`}
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
                                    search
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="list-product-block relative md:pt-10 pt-6">
                        <div className="heading6">Product Search: {query || 'All Products'}</div>
                        {loading ? (
                            <div className="flex justify-center items-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
                            </div>
                        ) : (
                            <div className={`list-product hide-product-sold grid lg:grid-cols-4 sm:grid-cols-3 grid-cols-2 sm:gap-[30px] gap-[20px] mt-5`}>
                                {currentProducts.map((item) => (
                                    item.id === 'no-data' ? (
                                        <div key={item.id} className="no-data-product col-span-full text-center py-10">
                                            No products match the selected criteria.
                                        </div>
                                    ) : (
                                        <Product key={item.id} data={item} type='grid' />
                                    )
                                ))}
                            </div>
                        )}

                        {!loading && pageCount > 1 && (
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

export default SearchResult