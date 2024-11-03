import { useEffect, useState, useCallback } from "react";
import { orderData, postOrderData } from "../types/OrderType";
import { _get,_post,_put } from "../utils/api";

interface UseOrderResult {
    orders: orderData[] | null;
    loading: boolean;
    fetchOrderById: (orderId: string) => Promise<any>;
    cancelOrder: (orderId: string) => Promise<any>;
    editOrderStatus: (orderId: string, status: string) => Promise<any>;
    createOrder: (order: postOrderData) => Promise<any>;
}

const useOrder = (token: string): UseOrderResult => {
    const [orders, setOrders] = useState<orderData[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchOrdersByUser = async (token: string) => {
            setLoading(true);
            try {
                const response = await _get(`/orders/find`, token);
                const res: orderData[] = response.orders;
                setOrders(res);
            } catch (error: any) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrdersByUser(token);
    }, [token]);
    const fetchOrderById = async (orderId: string) => {
        setLoading(true);
        try {
            const response = await _get(`/orders/order/${orderId}`, token);
            setLoading(false);
            return response;
            
        } catch (error: any) {
            console.error(error);
            return null;
        }
    }
    const cancelOrder = async (orderId: string) => {
        setLoading(true);
        try {
            const response = await _put(`/orders/cancel/${orderId}`, {}, token);
            setLoading(false);
            return true;
        } catch (error: any) {
            console.error(error);
            return null;
        }
    }
    const editOrderStatus = async (orderId: string, status: string) => {
        setLoading(true);
        try {
            const response = await _put(`/orders/editOrderStatus/${orderId}`, { status }, token);

            setLoading(false);
            return response;
        } catch (error: any) {
            console.error(error);
            return null;
        }
    }
    const createOrder = async (order: postOrderData) => {
        setLoading(true);
        try {
           
            const response = await _post(`/orders/createOrder`, order, token);
            setLoading(false);
            return response.orders;
        } catch (error: any) {
            console.error(error);
            return null;
        }
    }

    return { orders, loading, fetchOrderById, cancelOrder , editOrderStatus, createOrder};
}

export default useOrder;
