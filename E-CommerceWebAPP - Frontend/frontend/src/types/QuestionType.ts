import { productData } from "./ProductType";
import { replyData } from "./ReplyType";
import { reviewUserData } from "./UserType";

interface questionProductData{
    _id: string;
    name: string;
    images: string;
}
interface questionData{
    id: string;
    user: reviewUserData;
    product: questionProductData;
    content: string;
    createdAt: string;        
    updatedAt: string;
    replies?: replyData[];
}
interface postQuestionData{
    id: string;
    user: reviewUserData;
    product: questionProductData;
    content: string;
    createdAt: string;        
    updatedAt: string;
    replies?: replyData[];
}
export type {questionData, postQuestionData}; 