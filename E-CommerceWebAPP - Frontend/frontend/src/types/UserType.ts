import { addressData } from "./AddressType";
interface loginData {
    email: string;
    password: string;
  }
  interface registerDataCustomer {
    name: string;
    email: string;
    password: string;
    confirm_password: string;
    phoneNumber?: string;
    address?: addressData;
    role: userRole;
  }
  interface registerDataDistributor {
    name: string;
    email: string;
    password: string;
    confirm_password: string;
    phoneNumber: string;
    address: addressData;
    CUI: string;
    role: userRole;
  }
  interface DataCustomer {
    id: string;
    address: addressData;
    paymentMethod: string;
    isVerified: boolean;
    createdAt: string;
  }
interface DataDistributor {
    id: string;
    address: addressData;
    CUI: string;
    isAuthorized: boolean;
    createdAt: string;
  }
type userRole = 'customer' | 'distributor' | 'admin';

interface userData{
    _id: string;
    id: string;
    name: string;
    email: string;
    password: string;
    customerInfo?: DataCustomer;
    distributorInfo?: DataDistributor;
    confirm_password: string;
    role?: string;
    phoneNumber?: string;
    address?: addressData;
    isVerified?: boolean;
    CUI?: string;
    isAuthorized?: boolean;
}

interface reviewUserData{
  name: string;
  role: string;
  _id: string;
}

export type {reviewUserData, userRole, loginData, DataCustomer, DataDistributor, registerDataCustomer, registerDataDistributor , userData};
