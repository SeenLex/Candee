interface cartProduct {
    product: string;
    quantity: number;
  }
  
  interface cartData {
    user: string;
    products: cartProduct[];
    createdAt: Date;
    updatedAt: Date;
  }
  
  export default cartData;