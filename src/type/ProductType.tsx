// type/ProductType.ts
export interface CategoryType {
    id: number;
    name: string;
  }
  
  export interface ProductType {
    id: string;
    name: string;
    price: number;
    originPrice: number;
    sale: boolean;
    new: boolean;
    images: string;
    sizes: string;
    description: string;
    category: string;
    subcategory: string;
    design: string;
    variation: string;
    gender: string;
    brand: string;
    sold: number;
    color:string
    type: string; // this will match category.name.toLowerCase()
  }