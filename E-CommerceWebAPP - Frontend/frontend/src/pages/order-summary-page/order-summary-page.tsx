import React, { useEffect, useState } from "react";
import './order-summary-page.css';
import { useLocation, useNavigate } from "react-router";

const OrderSummaryPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [paymentStatus, setPaymentStatus] = useState('');

    const order = location.state?.newOrder;
   
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const redirectStatus = queryParams.get('redirect_status');
    
        if (redirectStatus === 'succeeded') {
          setPaymentStatus('Payment succeeded!');
        } else {
          setPaymentStatus('Payment failed or cancelled.');
        }

        const timer = setTimeout(() => {
            navigate('/');
        }, 10000)
        return () => clearTimeout(timer);
      }, [location, navigate]);

      return (
        <div className="order-summary-container">
            <div className="order-summary-data">
                {order && order.paymentMethod === 'Cash On Delivery' ? (
                    <>
                        <h1>Your order summary</h1>
                        <div className="personal-data-container">
                            <h2>Personal information</h2>
                            <div className="personal-data-wrapper">
                                <p><strong>Name:</strong> {order.name}</p>
                                <p><strong>Phone number:</strong> {order.phoneNumber}</p>
                                <p><strong>Payment:</strong> {order.paymentMethod}</p>
                            </div>
                            <div className="address-container">
                                <h2>Delivery address</h2>
                                <div className="address-info-wrapper">
                                    <p><strong>Country:</strong> {order.address.country}</p>
                                    <p><strong>County:</strong> {order.address.county}</p>
                                    <p><strong>City:</strong> {order.address.city}</p>
                                    <p><strong>Street:</strong> {order.address.street}</p>
                                    <p><strong>Number:</strong> {order.address.number}</p>
                                    <p><strong>Zip code:</strong> {order.address.zip}</p>
                                </div>
                            </div>
                        </div>
                        <h1>Ordered products: </h1>
                        <div className="ordered-products-container">
                            {order.products.map((product) => (
                                <div key={product.productId} className="product-data">
                                    <p>Product ID: {product.productId}</p>
                                    <p>Quantity: {product.quantity}</p>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <>
                        <h1>Your order summary</h1>
                        <h2>{paymentStatus}</h2>
                    </>
                )}
            </div>
            <div className="redirect-text">
                <h2>You will be redirected in 10 seconds...</h2>
                <button onClick={() => navigate('/')}>Go to homepage</button>
            </div>
        </div>
    );
}
export default OrderSummaryPage;