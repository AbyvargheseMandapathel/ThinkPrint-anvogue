'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface ProductProps {
  data: {
    id: number;
    title: string;
    short_description: string;
    image?: string;
  }
}

const Product: React.FC<ProductProps> = ({ data }) => {
  const truncateDescription = (desc: string) => {
    if (!desc) return '';
    return desc.length > 50 ? `${desc.slice(0, 50)}...` : desc;
  };

  const imageSrc = data.image || '/images/placeholder.jpg';

  return (
    <div className="product-card group relative overflow-hidden rounded-2xl bg-white shadow-md transition-transform duration-300 hover:shadow-xl">
      {/* Product Image */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={imageSrc}
          alt={data.title}
          onError={(e) => {
            e.currentTarget.src = '/images/fallback-product.png';
            e.currentTarget.alt = 'Product image not available';
          }}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-sm font-semibold line-clamp-1">{data.title}</h3>
        <p className="text-secondary text-sm min-h-[2rem] mt-2">
          {truncateDescription(data.short_description)}
        </p>
      </div>

      {/* Hover Overlay with Buttons */}
      <div className="absolute inset-0 z-10 hidden items-center justify-center gap-3 bg-black/50 opacity-0 transition-opacity duration-300 group-hover:flex group-hover:opacity-100">
        <Link
          href={`/product/${data.id}`}
          className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition-colors hover:bg-gray-200"
          aria-label={`View details for ${data.title}`}
        >
          View More
        </Link>
      </div>
    </div>
  );
};

export default Product
