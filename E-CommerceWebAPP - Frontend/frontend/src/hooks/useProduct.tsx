import { useEffect, useState, useCallback } from "react";
import { productData } from "../types/ProductType";
import { _delete, _get,_post,_put } from "../utils/api";
import { useAuth } from "./useAuth";
import { useLocation } from "react-router";

interface UseOrderResult {
  fetchProducts: () => void;
  product: productData | null;
  fetchProductById: (productId: string) => Promise<void>;
  products: productData[] | null;
  setProducts: (products: productData[] | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  filterProducts: (filters: Filters) => void;
  deleteProduct: (productId: string) => Promise<string>;
  distributorProducts: productData[] | null;    
  addProduct: (product: FormData) => Promise<string>;
  fetchProduct: (productId: string) => Promise<productData | null>;
  editProduct: (productId: string,product: FormData) => Promise<string>;
  setDistributorProducts: (products: productData[] | null) => void;   
}

interface Filters {
  availability: {
    inStock: boolean;
    outOfStock: boolean;
  };
  price: [number, number];
  category: string;
  brand: string[];
}

const useProduct = (byCategory = false): UseOrderResult => {
  const { token, user } = useAuth();
  const [product, setProduct] = useState<productData | null>(null);
  const [products, setProducts] = useState<productData[] | null>(null);
  const [distributorProducts, setDistributorProducts] = useState<productData[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const location = useLocation();


  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await _get(`/products/findAll`, {}, {});
      setProducts(response.products);
     
    } catch (error: any) {
      console.error("Error fetching all products:", error);
    } finally {
      setLoading(false);
    }
  }, []);
  
  const fetchProductsByCategory = useCallback(async () => {
    setLoading(true);
    console.log(location.pathname);
    try {
      const category = location.pathname.split("/")[2].replace(/-/g, " ");
      const response = await _get(`/products/findCategory/${category}`, {}, {});
      console.log("response:",response);
      setProducts(response);
    } catch (error: any) {
      console.error("Error fetching products by category:", error);
    } finally {
      setLoading(false);
    }
  }, [location.pathname]);

  const fetchProductById = useCallback(async (productId: string) => {
    setLoading(true);
    try {
      const response = await _get(`/products/find/${productId}`, {}, {});
      setProduct(response.product);
    } catch (error: any) {
      console.error("Error fetching product by id:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProductsDistributor = useCallback(async () => {
    if (!user?.role || user.role !== "distributor" || !user.id) {
      return;
    }
    setLoading(true);
    try {
      const response = await _get(`/products/findDistributor/${user.id}`, token);
      setDistributorProducts(response.products);
    } catch (error: any) {
      console.error("Error fetching distributor products:", error);
    } finally {
      setLoading(false);
    }
  }, [user, token]);

  useEffect(() => {
    if (byCategory) {
      fetchProductsByCategory();
    } else {
      fetchProducts();
    }
    fetchProductsDistributor();
  }, [location.pathname]);

  const fetchProduct = async (productId: string) => {
    try {
      const response = await _get(`/products/find/${productId}`, {}, token as string);
      return response.product;
    } catch (error: any) {
      console.error("Error fetching product:", error);
      return null;
    }
  }



  const deleteProduct = async (productId: string) => {
    try {
      const res = await _delete(`/products/delete/${productId}`, {}, token);
      return res.message;
    
    } catch (error: any) {
      console.error("Error deleting product:", error);
      return "Error deleting product";
    
    }
  };
  const addProduct = async (product: FormData) => {
    try {
      const res = await _post(`/products/add`, product, token);
      return res.message;
    } catch (error: any) {
      console.error("Error adding product:", error);
      return "Error adding product";

    
    }
  }
  const editProduct = async (productId:string,product: FormData) => {
    try {
   
      const res = await _put(`/products/edit/${productId}`, product, token);
      return res.message;
    } catch (error: any) {
      console.error("Error editing product:", error);
      return "Error editing product";
    }
  }

  const filterProducts = async (filters: Filters) => {
    try {
   
      const response = await _post(`/products/findFilter`, filters, token);
      setProducts(response);
    } catch (error: any) {
      console.error(error);
    }
  }


  return { fetchProductById,product,products, setProducts, loading, setLoading, deleteProduct, distributorProducts, addProduct ,fetchProduct, editProduct,setDistributorProducts, fetchProducts, filterProducts };

};

export default useProduct;