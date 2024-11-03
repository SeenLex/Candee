import React from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './order.css';

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: 'http://localhost:5173/order/summary',
      },
    });

    if (error) {
      console.error('Payment failed:', error);
    } else {
      console.log('Payment succeeded!');
    }
  };

  const paymentElementOptions = {
    style: {
      base: {
        color: '#32325d',          
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
      complete: {
        color: '#4caf50',
        iconColor: '#4caf50',
      },
    },
  };

  return (
    <form className="stripe-form" onSubmit={handleSubmit}>
      <PaymentElement options={paymentElementOptions} />
      <button className="checkout-form-button" type="submit" disabled={!stripe}>
        Pay
      </button>
    </form>
  );
};

export default CheckoutForm;