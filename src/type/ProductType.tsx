interface Variation {
    color: string;
    colorCode: string;
    colorImage: string;
    image: string;
}

export interface ProductType {
    id: string;
    name: string;
    new: boolean;
    sale: boolean;
    price: number;
    originPrice: number;
    image: string;
    description: string;
    category: string;
    type: string;
}