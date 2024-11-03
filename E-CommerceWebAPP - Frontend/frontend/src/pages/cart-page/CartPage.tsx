import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Favorite, DeleteOutline } from "@mui/icons-material";
import useCart from "../../hooks/useCart";
import useFavourite from "../../hooks/useFavourite";
import "./CartPage.css";
import toast from "react-hot-toast";
import Spinner from "../../components/spinner/spinner";

const CartPage = () => {
  const { token,user } = useAuth();
  const { cart, setCart, editProductQuantity, removeProduct, loading } = useCart(token as string);
  const { addToFavourite, removeFavourite } = useFavourite(token);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();
  const shipping = 12.99;

  useEffect(() => {
    const calculateTotalPrice = () => {
      let total = 0;
      cart.products.forEach((product) => {
        if(product.product.discountPrice && product.product.discountPrice < product.product.price){
          total += product.quantity * product.product.discountPrice;
        }else{
          total += product.quantity * product.product.price;
        }
      });
      setTotalPrice(Math.round(total * 100) / 100);
    };

    calculateTotalPrice();
  }, [cart]);

  const handleEditProductQuantity = async (product, type) => {
    let quantity = product.quantity;
    let stock = product.product.stock;

    if (type === "increase") {
      quantity++;
      stock--;
      await editProductQuantity(product, type);
    } else if (type === "decrease") {
      quantity--;
      stock++;
      if (quantity <= 0) {
        await removeProduct(product.product, token);
        const newCart = cart.products.filter(
          (cartItem) => cartItem.product._id !== product.product._id
        );
        setCart({ ...cart, products: newCart });
        return;
      } else {
        await editProductQuantity(product, type);
      }
    }

    const newCart = cart.products.map((cartItem) =>
      cartItem.product._id === product.product._id
        ? { ...cartItem, quantity, product: { ...cartItem.product, stock } }
        : cartItem
    );

    setCart({ ...cart, products: newCart });
  };

  const handleFavourites = async (product) => {
    if (addToFavourite) {
      const result = await addToFavourite(product._id);
      if (!result) {
        toast.error("Product already in favourites");
        return;
      }

      await removeProduct(product, token);
    } else {
      await removeFavourite(product._id);
    }
  };

  const handleRemove = async (product) => {
    await removeProduct(product, token);
    const newCart = cart.products.filter(
      (cartItem) => cartItem.product._id !== product._id
    );
    setCart({ ...cart, products: newCart });
  };

  const handleCheckout = () => {
   
    navigate("/checkout", { state: { cart, token, user } });
  };

  if (loading) {
    return (
      <div className="cart-page">
        <div className="cart-page-title">Your Cart</div>
          <Spinner />
        </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-page-title">Your Cart</div>
      <div className="cart-boxes">
        <div className="cart-items">
          {cart.products && cart.products.length > 0 ? (
            cart.products.map((product) => (
              <div className="cart-item" key={product?.product?._id}>
                <img
                    src={product?.product?.images[0]}
                    alt={product?.product?.name}
                    className="cart-item-image"
                  />
                <div className="cart-item-details">
                  
                  <h2 className="cart-item-title">{product?.product?.name}</h2>
                  
                  <div className="cart-item-availability">
                    Availability: {product?.product?.stock}
                  </div>
                </div>
                <div className="cart-item-right">
                  <div className="cart-item-price">
                    <div>{product?.product?.discountPrice < product.product.price ? (
                      <>
                        <span className="discount-price">
                          {product?.product?.discountPrice} $
                        </span>
                      </>
                    ) : (
                      <span>{product?.product?.price} $</span>
                    )}</div>
                    <div>
                      Total:{" "}
                      {Math.round( 
                        product?.product?.discountPrice < product.product.price ? (
                          product?.product?.discountPrice * product?.quantity
                        ) * 100 : (
                          product?.product?.price * product?.quantity
                        ) * 100
                      ) / 100}{" "}
                    </div>
                  </div>
                  <div className="cart-item-quantity">
                    <button
                      className="remove-quantity-button"
                      onClick={() =>
                        handleEditProductQuantity(product, "decrease")
                      }
                      disabled={product.quantity <= 0}
                    >
                      -
                    </button>
                    <span>{product?.quantity}</span>
                    <button
                      className="add-quantity-button"
                      onClick={() =>
                        handleEditProductQuantity(product, "increase")
                      }
                      disabled={product?.product?.stock <= 0}
                    >
                      +
                    </button>
                  </div>
                  <div className="cart-item-actions">
                    <div
                      className="cart-item-action-favourites"
                      onClick={() => handleFavourites(product?.product)}
                    >
                      <Favorite style={{ marginRight: "8px", color: "red" }} />
                      Move to Favourites
                    </div>
                    <div
                      className="cart-item-action-remove"
                      onClick={() => handleRemove(product?.product)}
                    >
                      <DeleteOutline style={{ marginRight: "8px" }} />
                      Remove
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="zero">The cart is empty</div>
          )}
        </div>
        {cart.products && cart.products.length > 0 && (
          <div className="cart-total">
            <div className="summary">Order Summary</div>
            <div className="product-price-details">Product Price: {totalPrice} $</div>
            <div className="shipping-details">
              {totalPrice > 100 ? (
                <div>Shipping: Free</div>
              ) : (
                <div>Shipping: {shipping} $</div>
              )}
            </div>
            <div className="total">
              Cart Total: {totalPrice > 100 ? totalPrice : totalPrice + shipping} $
            </div>
            {user?.customerInfo?.isVerified ? (
              <div
              className="checkout-button"
              onClick={handleCheckout}
              role="button"
              tabIndex={0}
              >
                Go to Checkout
              </div>
            ) : (
              <div className="checkout-button-container">
                <p>Please verify your account to proceed to checkout</p> 
                <button onClick={() => navigate(`/user-dashboard/${user?._id}`)}>Go to account</button>
            </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
