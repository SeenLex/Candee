import React, { useCallback, useEffect, useRef, useState } from "react";
import "./product-page.css";
import { useParams } from "react-router";
import useProduct from "../../hooks/useProduct";
import { useAuth } from "../../hooks/useAuth";
import useFavourite from "../../hooks/useFavourite";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import StarIcon from "@mui/icons-material/Star";
import ReviewsSubmenu from "../../components/product-page-submenus/reviews-submenu/reviews-submenu.tsx";
import QuestionsSubmenu from "../../components/product-page-submenus/questions-submenu/questions-submenu.tsx";
import Spinner from "../../components/spinner/spinner.tsx";
import useCart from "../../hooks/useCart.tsx";
import toast from 'react-hot-toast'

const ProductPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const { loading, product, fetchProductById } = useProduct();

  const { user, token } = useAuth();
  const {addProductToCart} = useCart(token as string);
  const { addToFavourite, removeFavourite, isProductFavourite } = useFavourite(token);
  
  const [isFavourite, setIsFavourite] = useState<boolean>(false);
  const [selectedMenu, setSelectedMenu] = useState<string>("Reviews");
  const [selectedImage, setSelectedImage] = useState<string>(product?.images[0] || "");

  const reviewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (productId) {
      fetchProductById(productId);
    }
  }, [productId, fetchProductById]);

  const loadSelectedMenu = () => {
    switch (selectedMenu){
      case "Reviews":
        return <ReviewsSubmenu user={user} reviewRef={reviewRef} productId={productId} token={token} />;
      case "Questions":
        return <QuestionsSubmenu productId={productId} user={user} token={token} />;
      default:
        return <ReviewsSubmenu user={user} reviewRef={reviewRef} productId={productId} token={token} />;
    }
  }


  useEffect(() => {
    if (product && productId) {
      const isFav = isProductFavourite(productId);
      setIsFavourite(isFav);
      setSelectedImage(product.images[0]);
    }
  }, [productId, product, isProductFavourite]);
 const handleProudct = useCallback(async ()=>{
    try{
      await addProductToCart (product,token)
      toast.success('Product added to cart')
    }catch{
      toast.error('Error adding product to cart')
    }
 },[product])
  const handleFavorite = useCallback(async () => {
    try {
      if (isFavourite) {
        await removeFavourite(productId);
        setIsFavourite(false);
      } else {
        await addToFavourite(productId);
        setIsFavourite(true);
      }
    } catch (error) {
      console.error("Failed to update favorite status", error);
    }
  }, [isFavourite, product, addToFavourite, removeFavourite]);

  const scrollToReviews = () => {
    setSelectedMenu("Reviews");

    setTimeout(() => {
      if(reviewRef.current){
        reviewRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 0);
  }
  
  const handleImageClick = (image: string) => {
    setSelectedImage(image);
  }

  const calculateDiscountPercentage = (price: number, discountPrice: number): number => {
    return Math.round(((price - discountPrice) / price) * 100);
  };

  if (product?.discountPrice && product?.price) {
    product.calculatedDiscountPercentage = calculateDiscountPercentage(product.price, product.discountPrice);
  }

  if (loading || !product) {
    return(
      <div>
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <div className="product-main-container">
        <div className="product-data-container">
          <div className="horizontal-data">
            <div className="image-container">
              <img src={selectedImage || "https://placehold.jp/150x150.png"} alt="selected-product-image" />
              <div className="secondary-images">
                {product?.images?.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt="selected-product-image"
                    onClick={() => handleImageClick(image)}
                  />
                ))}
              </div>
            </div>
            <div className="buy-data">
              {product?.name && <h1>{product?.name}</h1>}
              {product?.calculatedDiscountPercentage > 0 ? (
                <div className="discount-price-display">
                  <h3>{product?.price} $</h3>
                  <h1>{product?.discountPrice}$(-{product.calculatedDiscountPercentage}%)</h1>
                </div>
                ) : (
                  <h1>{product?.price} $</h1>
                )
              }
              <div className="rating-product-display" onClick={scrollToReviews}>
                <h3>{product?.ratingProduct}</h3>
                <StarIcon style={{ color: "yellow" }} />
                <p>({product?.numberOfReviews || "0"})</p>
                {product?.stock > 0 ? (
                  <p style={{color: "#12FE01"}}>In stock</p>
                ) : (
                  <p style={{color: "var(--danger-color)"}}>Out of stock</p>
                )}
              </div>
              <div className="product-button-container">
                <button onClick={handleProudct} >
                  <AddShoppingCartIcon></AddShoppingCartIcon>
                </button>
                <button onClick={handleFavorite}>
                  <FavoriteIcon style={{ color: isFavourite ? "pink" : "white" }}></FavoriteIcon>
                </button>
              </div>
            </div>
          </div>
          <div className="product-info-container">
            <h2>{product?.name}</h2>
          
            <h3>{product?.description}</h3>
          </div>
        </div>
        <div className="select-button-container">
          <button
            className={selectedMenu === "Reviews" ? "selected" : ""}
            onClick={() => setSelectedMenu("Reviews")}
          >
            Reviews
          </button>
          <button
            className={selectedMenu === "Questions" ? "selected" : ""}
            onClick={() => setSelectedMenu("Questions")}
          >
            Questions
          </button>
        </div>
        {loadSelectedMenu()}
      </div>
    </>
  );
};

export default React.memo(ProductPage);
