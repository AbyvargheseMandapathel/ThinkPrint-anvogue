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
    image: string;
    description: string;
    category: string;
    type: string; // this will match category.name.toLowerCase()
  }