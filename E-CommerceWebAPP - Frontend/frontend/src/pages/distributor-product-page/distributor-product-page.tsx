import React, { useState, useEffect } from 'react';
import Form from '../../components/controls/form/form';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, useParams } from 'react-router-dom';
import useProduct from '../../hooks/useProduct';
import './distributor-product-page.css';
import { Category } from '../../types/CategoryType';
import toast from 'react-hot-toast';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  discountPercentage?: number;
  images: (string | File)[];
  stock: number;
  brand: string;
  categories: Category[];
  distributor?: string;
  isActive?: boolean;
}

const DistributorProductPage = ({type}: {type: string}) => {
  const { user } = useAuth();
  const { productId } = type === 'edit-product' ? useParams<{ productId: string }>() : { productId: '' };
  const { addProduct, fetchProduct, editProduct } = useProduct();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Product>({} as Product);
  
  useEffect(() => {
    if (type === 'edit-product' && productId) {
      fetchProduct(productId).then((product) => {
        if (product) {
      
          const { createdAt, updatedAt, ratingProduct, numberOfReviews, reviews, questions, ...rest } = product;
          setFormData({
            ...rest,
            _id: productId,
            images: product?.images || [],
          });
        }
      });
    }
  }, [type, productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (type === 'edit-product' && !formData._id) {
      toast.error('Product ID is missing. Unable to edit product.');
      return;
    }
    
    const formDataToSend = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'images') {
        //Existing images are strings, new images are files
        const existingImages = value.filter((img): img is string => typeof img === 'string');
        existingImages.forEach(imgUrl => formDataToSend.append('images', imgUrl));

        //Filter out the new images and append them to the form data
        const newImages = value.filter((img): img is File => img instanceof File);
        newImages.forEach(file => formDataToSend.append('images', file));
      } else if (key === 'categories') {
        const categoryIds = (value as Category[]).map(category => category._id).join(',');
        formDataToSend.append('categories', categoryIds);
      } else {
        formDataToSend.append(key, value as string | Blob);
      }
    });

    try {
      const response = type === 'edit-product' ? await editProduct(formData._id, formDataToSend): await addProduct(formDataToSend);
      if(response === 'Product updated successfully' || response === 'Product added successfully') {
         toast.success(response);
         navigate(`/user-dashboard/${user?._id}`);
      }
      else {
        toast.error('Error adding product');
      }
     
      
    } catch (error) {
      console.error('Error adding product', error);
      toast.error('Error adding product');
    }
  };
  return (
    <div className="add-product-container">
      <header>
        <h1>
          {user?.role === 'distributor' || user?.role === 'admin'
            ? type === 'add-product' ? 'Add Product' : 'Edit Product' 
            : 'Access Denied'}
        </h1>
      </header>
      <main>
        {user?.role !== 'distributor' && user?.role !== 'admin' ? (
          <div className="access-denied">
            <h2>Access Denied</h2>
            <p>You are not authorized to view this page.</p>
          </div>
        ) :
        <Form
          fieldList={[
            { id: 'name', label: 'Product Name', type: 'text', placeholder: 'Enter product name', icon: 'product' },
            { id: 'description', label: 'Description', type: 'textarea', placeholder: 'Enter product description', icon: 'description' },
            { id: 'categories', label: 'Category', type: 'category', placeholder: 'Enter category', icon: 'category' },
            { id: 'brand', label: 'Brand', type: 'text', placeholder: 'Enter brand', icon: 'brand' },
            { id: 'price', label: 'Price', type: 'number', placeholder: 'Enter price', icon: 'price' },
            { id: 'discountPrice', label: 'Discount Price', type: 'number', placeholder: 'Enter discount price', icon: 'price' },
            { id: 'images', label: 'Images', type: 'file', placeholder: 'Select images', icon: 'image' }, 
            { id: 'stock', label: 'Stock', type: 'number', placeholder: 'Enter stock', icon: 'stock' },
            type === 'edit-product' ? { id: 'isActive', label: 'Active', type: 'checkbox', placeholder: 'Enter product status', icon: 'status' } : null
          ].filter(Boolean)}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          type={type}
        />
  }
      </main>
    </div>
  );
};

export default DistributorProductPage;