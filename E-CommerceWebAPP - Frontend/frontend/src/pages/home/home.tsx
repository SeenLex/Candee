import React, { useCallback, useEffect, useState } from "react";
import "./home.css";
import useProduct from '../../hooks/useProduct';
import ProductCard from '../../components/product-card/product-card';
import ProductSlider from "../../components/product-slider/product-slider";
import { productData } from "../../types/ProductType";
import Spinner from "../../components/spinner/spinner";
import useFavourite from "../../hooks/useFavourite";
import { useAuth } from "../../hooks/useAuth";


const Home = () => {
  const { products, loading } = useProduct();
  const { token, user } = useAuth();
  const { addToFavourite, removeFavourite, isProductFavourite } = useFavourite(token as string);

  

  const [favouriteProducts, setFavouriteProducts] = useState<string[]>(products?.filter(product => isProductFavourite(product._id)).map(product => product._id) || []);
  const [mostRecentProducts, setMostRecentProducts] = useState<productData[]>([]);
  
  const productBatch = 24;

  useEffect(() => {
    if (products) {
      const newProducts = [...products].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      const mostRecentProducts = newProducts.slice(0, 10);
      setMostRecentProducts(mostRecentProducts);

      const favProducts = products.filter(product => isProductFavourite(product._id)).map(product => product._id);
      setFavouriteProducts(favProducts);
    }
  }, [products, isProductFavourite]);

  const handleFavoriteToggle = useCallback(async (productId: string) => {
    if (favouriteProducts.includes(productId)) {
        await removeFavourite(productId);
        setFavouriteProducts(favouriteProducts.filter(id => id !== productId));
    } else {
        await addToFavourite(productId);
        setFavouriteProducts([...favouriteProducts, productId]);
    }
}, [favouriteProducts, addToFavourite, removeFavourite]);

  if (loading) {
    return(
      <div className="home">
        <Spinner />
      </div>
    );
  }

  return (

    <div className="home">
      <div className="product-slider-container">
        <h1>New arrivals</h1>
        <ProductSlider products={mostRecentProducts as productData[]} favouriteProducts={favouriteProducts} onFavouriteToggle={handleFavoriteToggle}/>
      </div>
      {(token && user?.role === "customer") ?(
        <>
          <div className="all-products-container">
            {products?.slice(0, productBatch).map((product) => (
              <ProductCard key={product._id} product={product} loading={loading} isFavourite={favouriteProducts.includes(product._id)} onFavouriteToggle={handleFavoriteToggle} />
            ))}
          </div>
          <div className="product-slider-container">
            <h1>Your favourite products</h1>
            <ProductSlider products={products?.filter(product => favouriteProducts.includes(product._id)) as productData[]} favouriteProducts={favouriteProducts} onFavouriteToggle={handleFavoriteToggle}/>
          </div>
          <div className="all-products-container">
            {products?.slice(productBatch, products.length).map((product) => (
            <ProductCard key={product._id} product={product} loading={loading} isFavourite={favouriteProducts.includes(product._id)} onFavouriteToggle={handleFavoriteToggle} />
          ))}
          </div>
        </>
      ) : (
        <div className="all-products-container">
          {products?.map((product) => (
            <ProductCard key={product._id} product={product} loading={loading} isFavourite={favouriteProducts.includes(product._id)} onFavouriteToggle={handleFavoriteToggle} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
