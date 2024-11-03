import React, { useEffect, useState,useCallback } from 'react';
import './orderDetails.css';
import { useAuth } from '../../hooks/useAuth';
import useOrder from '../../hooks/useOrder';
import { useParams } from 'react-router';
import { Edit } from '@mui/icons-material';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import { orderData } from '../../types/OrderType';
import { formatDateTime } from '../../utils/formatDataTime';
import toast from 'react-hot-toast';

const OrderDetails: React.FC = () => {
  const { user, token } = useAuth();
  const { orderId } = useParams();
  const { fetchOrderById, loading,cancelOrder,editOrderStatus } = useOrder(token as string);

  const [order, setOrder] = useState<orderData | null>(null);

  useEffect(() => {
    if (orderId) {
      fetchOrderById(orderId as string).then((response) => {
        if (response) {
          setOrder(response.order);
        }
      });
    }
  }, [orderId]);

  const handleEditOrderStatus = useCallback((newStatus) => {
    const confirmEdit = window.confirm(`Are you sure you want to change the order status to ${newStatus}?`);
    if (!confirmEdit) {
      return;
    }
    editOrderStatus(orderId as string, newStatus).then((response) => {
      if (response) {
        toast.success('Order shipped successfully.');
        setOrder(prevOrder => ({
          ...prevOrder!,
          status: newStatus}));
        

      } else {
        toast.error('Error shipping order. Please try again.');
      }
    
    });
  }, []);

  const handleCancelOrder = useCallback(() => {

    const confirmCancel = window.confirm('Are you sure you want to cancel this order?');
    if (!confirmCancel) {
      return;
    }
      cancelOrder(orderId as string).then((response) => {
        if (response) {
          toast.success('Order canceled successfully.');
          setOrder(prevOrder => ({
            ...prevOrder!,
            status: 'Cancelled'
          }));
        } else {
          toast.error('Error canceling order. Please try again.');
        }
      });
    



  }, []);

  if (loading) {
    return (
      <div className="order-details">
        Loading...
      </div>
    );
  }
  const renderButtons = () => {
    const isPending = order?.status === 'Pending';
    const isDistributor = user?.role === 'distributor';
    const isAdmin = user?.role === 'admin';
  
    return (
      <>
        {isPending && (isDistributor || isAdmin ) && (
          <button className="btn-confirm" onClick={()=>handleEditOrderStatus('Shipped')}>
            <h3></h3>
            Confirm Shipment from Distributor
          </button>
        )}
        {isPending && (
          <button className="btn-cancel" onClick={handleCancelOrder}>
            Cancel Order
          </button>
        )}
        {order?.status === 'Shipped' && isAdmin && (
          <>
          <button className="btn-confirm" onClick={()=>handleEditOrderStatus('Delivered')}>
            Confim Delivery
          </button>
          <button className="btn-cancel" onClick={handleCancelOrder}>
            Cancel Delivery
          </button>
          </>
        )}

      </>
    );
  };

  return (
    <div className="order-container">
      <div className="order-header">
        <h1>Order nr. {order?.orderNumber}</h1>
        
        <div className="order-info">
          <p>Placed on: <strong>{formatDateTime(order?.createdAt as string)}</strong></p>
        </div>
        <div className="order-status">
            <p>Status: <strong>{order?.status}</strong></p> 
        </div>
      </div>
      <div className="order-details">
        <h2>Products sold by {order?.distributor.name}</h2>
        <div className="product-details">
          <div className="delivery-info">
            
           
          </div>
          <div className="delivery-modalities">
            <div className="delivery-method">
              <h4>Delivery Method:</h4>
              <p>DHL Express</p>
              <p>Customer: {order?.name} </p>
              <p>Phone: {order?.phoneNumber}</p>
            </div>
            <div className="billing-info">
            <h4>Delivery Address:</h4>
                <p>Country: {order?.address.country}</p>
                <p>County:{order?.address.county}</p>
                <p>City: {order?.address.city}</p>
                <p>Street: {order?.address.street}</p>
                <p>Number:{order?.address.number}</p>
                <p>Postal Code: {order?.address.zip}</p> 
            </div>
            <div className="payment-method">
              <h4>Payment Method</h4>
              <p>{order?.paymentMethod}</p>
              <p className="payment-status">
                <strong>Payment Status</strong> {order?.paymentStatus}
              </p>
              <p><strong>Order Status:</strong>{order?.status}</p> 
              <div className="order-actions">
                {renderButtons()}
              </div>
             
            </div>
          </div>
          {order?.products.map((p, index) => (
            <div key={index} className="product-item">
              <img src={p?.product?.images[0]} alt="Product" />
              <div className="product-description">
                <p className="product-name">{p?.product?.name}</p>
                <p className="product-price">{p?.product?.price}<sup> $</sup></p>
                <p className="product-quantity">{p?.quantity} buc</p>
              </div>
            </div>
          ))}
          <div className="order-summary">
            <h3>Order Summary</h3>
            <p>Subtotal: <strong>{Math.round(order?.totalPrice as number)}<sup> $</sup></strong></p>
            <p>Shipping: <strong>12.99<sup> $</sup></strong></p>
            <p>Total: <strong>{Math.round(order?.totalPrice as number) + 12.99}<sup> $</sup></strong></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;
