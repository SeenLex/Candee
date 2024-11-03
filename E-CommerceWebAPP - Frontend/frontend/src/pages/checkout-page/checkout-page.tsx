import React, { FormEvent, useState } from "react";
import "./checkout-page.css";
import useOrder from "../../hooks/useOrder";
import { useLocation, useNavigate } from "react-router";
import useCart from "../../hooks/useCart";

const CheckoutPage = () => {
    const [country, setCountry] = useState("");
    const [county, setCounty] = useState("");
    const [city, setCity] = useState("");
    const [street, setStreet] = useState("");
    const [number, setNumber] = useState("");
    const [zip, setZip] = useState("");
    const [payment, setPayment] = useState("Cash On Delivery");
    const [phoneNumber, setPhoneNumber] = useState("");

    const location = useLocation();
    const navigate = useNavigate();

    const cart = location.state?.cart;
    const token = location.state?.token;
    const user = location.state?.user;
    const shipping = 12.99;


    
    const { emptyCart } = useCart(token);
    const { createOrder } = useOrder(token);

    const productsPrice = () => {
        return cart.products.reduce((acc, product) => {
            const price = product.product.discountPrice < product.product.price ? product.product.discountPrice : product.product.price;
            return acc + price * product.quantity;
        }, 0);
    };

    const orderTotal = productsPrice() > 100 ? productsPrice() : productsPrice() + shipping;

    const handleSendOrder = async (event:FormEvent) => {
        event.preventDefault();
        const newOrder = {
            address: {country, county, city, street, number, zip},
            products: cart.products.map((product) => ({productId: product.product._id, quantity: product.quantity})),
            name: user.name,
            phoneNumber: phoneNumber,
            paymentMethod: payment
        };
        try{
            await createOrder(newOrder);
            await emptyCart();
            if(payment === "Credit Card") {
                navigate('/order/pay', {state: {orderTotal}});
            }else{
                navigate('/order/summary', {state: {newOrder}});
            }
        }catch(err){
            console.error("Failed to create order: ", err);
        }
    };

    const handleGoBack = () => {
        navigate('/cart');
    };

    return(
        <div className="checkout-data-main-container">
            <div className="checkout-data-container">
                <form onSubmit={handleSendOrder}>
                    <div className="shipment-info">
                        <div className="delivery-data">
                            <h2>1. Delivery method</h2>
                            <h3>Deliver through courier at your location:</h3>
                            <div className="ship-address-container">
                                <div className="form-field">
                                    <label>Country</label>
                                    <input type="text" id="country" value={country} onChange={(e) => setCountry(e.target.value)} required placeholder="Country" ></input>
                                </div>
                                <div className="form-field">
                                    <label>County</label>
                                    <input type="text" id="county" value={county} onChange={(e) => setCounty(e.target.value)} required placeholder="County"></input>
                                </div>
                                <div className="form-field">
                                    <label>City</label>
                                    <input type="text" id="city" value={city} onChange={(e) => setCity(e.target.value)} required placeholder="City"></input>
                                </div>
                                <div className="form-field">
                                    <label>Street</label>
                                    <input type="text" id="street" value={street} onChange={(e) => setStreet(e.target.value)} required placeholder="Street"></input>
                                </div>
                                <div className="form-field">
                                    <label>Number</label>
                                    <input type="text" id="number" value={number} onChange={(e) => setNumber(e.target.value)} required placeholder="Number"></input>
                                </div>
                                <div className="form-field">
                                    <label>Zip code</label>
                                    <input type="text" id="zip" value={zip} onChange={(e) => setZip(e.target.value)} required placeholder="Zip code"></input>
                                </div>
                            </div>
                        </div>
                        <div className="payment-data">
                            <h2>2. Payment method</h2>
                            <div className="payment-data-fields">
                                <div className="form-field">
                                    <label>Payment method</label>
                                    <select id="payment" value={payment} required onChange={(e) => setPayment(e.target.value)}>
                                        <option disabled>Select an option</option>
                                        <option>Cash On Delivery</option>
                                        <option>Credit Card</option>
                                    </select>
                                </div>
                                <div className="form-field">
                                    <label>Phone number</label>
                                    <input type="tel" id="phone" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required placeholder="Phone number"></input>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="order-price-info">
                        <h2>Order summary</h2>
                        <div className="order-price-fields">
                            <h3>Products: {productsPrice().toFixed(2)} $</h3>
                            {productsPrice().toFixed(2) > 100 ? <h3>Free shipping</h3> : <h3>Shipping: {shipping} $</h3>}
                            <h2 className="order-total-text">Order total: {orderTotal.toFixed(2)}</h2>
                        </div>
                    </div>
                    <div className="checkout-button-container">
                        <button type="submit">{payment === "Cash On Delivery" ? "Send order" : "Go to payment"}</button>
                        <button onClick={handleGoBack} type="button">Go back</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
export default CheckoutPage