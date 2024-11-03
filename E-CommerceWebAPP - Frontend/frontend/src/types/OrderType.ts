import { addressData } from "./AddressType";
import { productDataForOrder } from "./ProductType";
import { DataDistributor, userData } from "./UserType";

interface orderData{
    _id: string;
    user:string;
    products:productDataForOrder[];
    status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
    name: string;
    email: string;
    phoneNumber: string;
    address: addressData;
    totalPrice: number;
    paymentMethod: string;
    distributor: userData;
    createdAt: string;
    orderNumber:string;


}

interface postOrderData{
    products: productDataForPlacingOrder[];
    name: string;
    phoneNumber: string;
    address: addressData;
    paymentMethod: string; 
}

interface productDataForPlacingOrder{
    productId: string;
    quantity: number;
}

export type {orderData, postOrderData};