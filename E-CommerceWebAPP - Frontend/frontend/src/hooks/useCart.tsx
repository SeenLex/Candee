import { useEffect, useState } from 'react';
import { productData } from '../types/ProductType';
import { _post, _get, _put, _delete } from '../utils/api';

interface CartProduct {
  product: productData;
  quantity: number;
  loading?: boolean;
}

const useCart = (token:string) => {
 
  const [cart, setCart] = useState<{ products: CartProduct[] }>({ products: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const response = await _get(`/cart/find`, token);
        setCart(response.cart);
      } catch (err) {
        console.error('Failed to fetch cart:', err);
      }finally{
        setLoading(false);
      }
    };

    if (token) {
      fetchCart();
    }
  }, [token]);

  const editProductQuantity = async (product,type) => {
    let quantity = product.quantity;
    let stock = product.product.stock;
    

    if (type === "increase" && stock > 0) {
      quantity++;
      stock--;
    } else if (type === "decrease" && quantity > 0) {
      quantity--;
      stock++;
    }

    try {
      await _put(`/cart/edit`, {productId: product.product._id, quantity },  token );
    } catch (err) {
      console.error('Failed to edit product quantity:', err);
    }
  };

  const addProductToCart = async ( product, token) => {
    try {
      await _put(`/cart/add`, { productId: product._id, quantity: 1 },  token );
    } catch (err) {
      console.error('Failed to add product to cart:', err);
    }
  };

  const removeProduct = async (product, token) => {
    try {
      await _delete(`/cart/deleteProduct`, { productId: product._id },  token );
      const updatedCart = cart.products.filter(item => item.product._id !== product._id);
      setCart({ ...cart, products: updatedCart });
    } catch (err) {
      console.error('Failed to remove product:', err);
    }
  };

  const emptyCart = async () => {
    try{
      const res = await _delete(`/cart/deleteAll`, {}, token);
      setCart({ products: [] });
    }catch(err){
      console.error('Failed to empty cart:', err);
    }
  }

  return { cart, setCart, editProductQuantity, removeProduct, addProductToCart, emptyCart, loading };
};

export default useCart;
