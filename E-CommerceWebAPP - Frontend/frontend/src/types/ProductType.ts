import { questionData } from "./QuestionType";
import { reviewData } from "./ReviewType";

interface productDataForOrder{
    product: productData;
    quantity: number;
}
interface productData {
    _id: string;                         
    name: string;
    price: number;
    discountPrice?: number;
    calculatedDiscountPercentage?: number;
    categories: string[];
    description: string;
    images: string;
    stock: number;
    brand: string;
    distributor: {
        _id: string;
        name: string
    }
    createdAt: string;
    updatedAt: string;
    ratingProduct?: number;
    numberOfReviews?: number;
    reviews?: reviewData[];
    questions?: questionData[];
    isActive: boolean;
  }
interface productFormData {
    
    name: string;
    description: string;
    price: string;
    image: string;
    category: string;
    stock: string;
}

  
export type {productDataForOrder, productData, productFormData}; 