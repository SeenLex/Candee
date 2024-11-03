import React, { useEffect,useState } from 'react';
import './order.css';
import { useNavigate } from 'react-router-dom';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import { orderData } from '../../types/OrderType';
import { formatDateTime } from '../../utils/formatDataTime';




const OrderSummary = ({order}:{order:orderData}) => {
  
  const navigate = useNavigate();

  return (
  
    <div className="orderSummary" key={order._id}>
      <div className="orderHeader">
        <span>Order : #{order?.orderNumber}</span>  

        <span className="orderDate">Placed on: {formatDateTime(order.createdAt)}</span>
        <span className="orderTotal">Total: {Math.round(order.totalPrice)} $</span>
     
        
      </div>
      
      <div className="orderItem">
        <div className="sellerRating">
        <span className="productTitle">Distributor: {order.distributor.name}</span>
        </div>
      
        <span className="productStatus">Status: {order.status}</span>

      </div>

     
      
      <div className="orderFooter">
        
        <button className="orderDetailsButton" onClick={() => navigate(`/order/${order.orderNumber}`)}>
        <KeyboardDoubleArrowDownIcon className="orderDetailsIcon"/>
          Order Details</button>
      </div>
    </div>
  );
};

export default OrderSummary;
