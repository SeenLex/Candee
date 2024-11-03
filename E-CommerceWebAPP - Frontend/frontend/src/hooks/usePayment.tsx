import React, { useEffect,useState } from 'react'
import { _get,_post } from '../utils/api';
import { useAuth } from './useAuth';
import { loadStripe } from '@stripe/stripe-js';

const usePayment = () => {
    const {token} = useAuth();
    const [stripePromise, setStripePromise] = useState(null);
    const [clientSecret, setClientSecret] = useState('');

    const fetchStripeConfig = async () => {
        try {
          const res = await _get('/payment/config', token);
          const { stripePublicKey: publicKey } = res;
          setStripePromise(loadStripe(publicKey));
        } catch (error) {
          console.error('Failed to fetch stripe config:', error);
        }
    };
    const createPaymentIntent = async (amount) => {
        try {
          const data = {
            amount,
            currency: 'ron',
          };
          const res = await _post('/payment/create-payment', data, token);
          setClientSecret(res);
        } catch (error) {
          console.error('Failed to create payment intent:', error);
        }
      };
   

  return {stripePromise, clientSecret, createPaymentIntent, fetchStripeConfig}
}

export default usePayment