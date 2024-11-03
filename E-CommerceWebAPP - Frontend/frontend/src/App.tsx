import React from 'react';
import { Routes, Route, useLocation} from 'react-router-dom';
import Home from './pages/home/home';
import CategoryPage from './pages/category-page/CategoryPage';
import RegisterPage from './pages/authentication-page/register';
import LoginPage from './pages/authentication-page/login';
import Navbar from './navbar/Navbar';
import Footer from './footer/Footer';
import AuthProvider from './hooks/useAuth';
import ProtectedRoute from './pages/authentication-page/protectedRoute';
import CartPage from './pages/cart-page/CartPage';
import PaymentCheckoutPage from './pages/payment-checkout-page/PaymentCheckoutPage';
import { Toaster } from 'react-hot-toast';

import UserProfilePage from './pages/user-profile-page/user-profile-page'
import FavoritePage from './pages/favorite-page/favorite-page'
import PublicRoute from './pages/authentication-page/publicRoute';
import AdminRoute from './pages/authentication-page/adminRoute';
import DistributorProductPage from './pages/distributor-product-page/distributor-product-page';
import Order from './pages/order-page/order';
import ProductPage from './pages/product-page/product-page';
import CreateOrder from './pages/order-page/create-order';
import CheckoutPage from './pages/checkout-page/checkout-page';
import OrderSummaryPage from './pages/order-summary-page/order-summary-page';

const App = () => {
  const location = useLocation();
  const disableNavPaths = ['/login', '/register/customer', '/register/distributor', '/admin/login'];
  const showNav = !disableNavPaths.includes(location.pathname);
  return (
    <>
         <AuthProvider>
   
          {showNav && <Navbar />}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path='/product/:productId' element={<ProductPage />} />
            <Route path="/category/:categoryId" element={<CategoryPage />} />
            <Route element={<PublicRoute/>}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register/:userRole" element={<RegisterPage />} />
            </Route>
            <Route element={<AdminRoute />}>
              <Route path='/admin-dashboard' element={<UserProfilePage />} />
            </Route>
            <Route element={<ProtectedRoute />}>
              
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/profile" element={<UserProfilePage />} />
              <Route path="/favorites" element={<FavoritePage />} />
              <Route path="/distributor-dashboard/:id" element={<UserProfilePage />} />
              <Route path='/user-dashboard/:id' element={<UserProfilePage />} />
             
              <Route path="/add-product" element={<DistributorProductPage type="add-product" />} />
              <Route path="edit-product/:productId" element={<DistributorProductPage type="edit-product" />} />
              <Route path="/order/:orderId" element={<Order />} />
              <Route path="/user-dashboard/:id/order/:orderId" element={<Order />} />
              <Route path="/order/pay" element={<CreateOrder/>} />
              <Route path="/order/summary" element={<OrderSummaryPage/>} />

            </Route>
  
            
          </Routes>
          {showNav && <Footer />}
          <Toaster />
    
        </AuthProvider>

    </>
  );
};

export default App;
