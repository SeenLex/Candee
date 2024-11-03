import React, { useState, useEffect } from 'react';
import './products-menu.css';

import ProductCard from '../../product-card/product-card';
import AddCircleOutline from '@mui/icons-material/AddCircleOutline';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import useProduct from '../../../hooks/useProduct';
import { productData } from '../../../types/ProductType';
import { userData } from '../../../types/UserType';

const ProductsMenu = ({user}:{user:userData}) => {
  const { loading,deleteProduct } = useProduct();
  const {distributorProducts,setDistributorProducts} = user?.role === 'distributor' ? useProduct() : {distributorProducts:null,setDistributorProducts:null};
  const {products,setProducts } = user?.role === 'admin' ? useProduct() : {products:null,setProducts:null};
  const [filteredProducts, setFilteredProducts] = useState<productData[] | null>(null);
  const navigate = useNavigate();
 
  useEffect(() => {
    setFilteredProducts(user?.role === 'distributor' ? distributorProducts : products);
  }, [distributorProducts,products,user?.role]);


  const searchProducts = (e) => {

    const searchValue = e.target.value.toLowerCase();
    const productsArray = user?.role === 'distributor' ? distributorProducts : products;
    const filtered = productsArray?.filter((product) => {
      return product.name.toLowerCase().includes(searchValue);
    });
    setFilteredProducts(filtered);
    
  };
  if (loading) {
    return <div>
      loading...
    </div>
  }

 

  return (
   
    <div className="distributor-products-menu">
      <div className="top-container-search">
        <h2>Search your product list</h2>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search products"
            onChange={searchProducts}
            className="search-input"
          />
          <SearchIcon className="icon" />
        </div>
      </div>
      
      <div className="add-container">
        {user?.role === 'distributor' &&
        <span>  
          <h2>Add new product </h2>
          <AddCircleOutline className="icon" onClick={()=>navigate('/add-product')} />
        </span>
        }
      </div>

      <div className="products-container">
        {filteredProducts && filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              loading={false}
              products={distributorProducts}
              setProducts={user?.role === 'distributor' ? setDistributorProducts : setProducts}
              deleteProduct={deleteProduct}

            />
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </div>
  );
};

export default ProductsMenu;

