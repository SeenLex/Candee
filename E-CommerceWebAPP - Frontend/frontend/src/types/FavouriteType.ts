import { productData } from "./ProductType";

interface favouriteData{
    user:string;
    products:productData[];
    createdAt:Date;
    updatedAt:Date;
}
interface favouriteItem {
    _id: string;
    product: productData;
}
export type {favouriteData, favouriteItem};