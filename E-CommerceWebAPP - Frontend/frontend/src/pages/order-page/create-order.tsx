import React, { useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import usePayment from '../../hooks/usePayment';
import './order.css';
import CheckoutForm from './checkout-form';
import { useLocation } from 'react-router';

const CreateOrder = () => {
  const { stripePromise, clientSecret, createPaymentIntent, fetchStripeConfig } = usePayment();

  let location = useLocation();
  const orderTotal = location.state?.orderTotal;

  useEffect(() => {
    fetchStripeConfig();
  }, []);

  useEffect(() => {
    if(orderTotal){
      createPaymentIntent(orderTotal * 100);
    }
  }, [orderTotal]);

  return (
    <div className="create-order">
      {stripePromise && clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
};

export default CreateOrder;