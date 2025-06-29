'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface ProductProps {
  data: {
    id: string;
    name: string;
    description: string;
    image: string;
    sale?: boolean;
    new?: boolean;
  }
}

const Product: React.FC<ProductProps> = ({ data }) => {
  const truncateDescription = (desc: string) =>
    desc.length > 30 ? `${desc.slice(0, 30)}...` : desc

  return (
    <div className="product-card group relative overflow-hidden rounded-2xl bg-white shadow-md transition-transform duration-300 hover:shadow-xl">
      {/* Product Image */}
      <div className="relative w-full" style={{ aspectRatio: '1.2/1' }}>
        <Image
          src={data.image}
          alt={data.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain object-center transition-transform duration-500 group-hover:scale-105"
        />
        {/* Badges like "Sale", "New" go here */}
        {data.sale && (
          <div className="absolute top-3 left-3 rounded-full bg-red px-3 py-1 text-xs font-bold uppercase text-white">
            Sale
          </div>
        )}
        {data.new && (
          <div className="absolute top-3 left-3 rounded-full bg-green px-3 py-1 text-xs font-bold uppercase text-white">
            New
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="heading6 mb-2 line-clamp-1">{data.name}</h3>
        <p className="text-secondary text-sm min-h-[2rem]">
          {truncateDescription(data.description)}
        </p>
      </div>

      {/* View More Button on Hover */}
      <Link
        href={`/product/default?id=${encodeURIComponent(data.id)}`}
        className="absolute inset-0 z-10 hidden items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300 group-hover:flex group-hover:opacity-100"
      >
        <button className="rounded-full bg-white px-6 py-2 text-sm font-semibold text-black transition-colors hover:bg-gray-200">
          View More
        </button>
      </Link>
    </div>
  )
}

export default Product