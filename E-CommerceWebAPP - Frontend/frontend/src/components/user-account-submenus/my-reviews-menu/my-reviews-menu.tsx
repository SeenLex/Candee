import React, { useState,useEffect } from "react";
import './my-reviews-menu.css';

import  {formatDateTime}  from "../../../utils/formatDataTime";
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import useReview from "../../../hooks/useReview";
import { userData } from "../../../types/UserType";
import { useNavigate } from "react-router";
import Spinner from "../../spinner/spinner";

const MyReviewsMenu = ({token,user}:{token:string,user?:userData | null}) => {
    const { reviews, loading: reviewsLoading, deleteReview, setReviews, fetchReviewsByUser } =  useReview(token as string)
    
    const navigate = useNavigate();

    useEffect(() => { 
        if(token){
            fetchReviewsByUser(token);
        }
    }, [token]);

    const handleDeleteReview = async (reviewId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this review?");
        if(!confirmDelete) return;

        await deleteReview(reviewId);
        const newReviews = reviews?.filter((review) => review._id !== reviewId) || null;
        setReviews(newReviews);

    };

    const handleImageClick = (productId: string) => {
        navigate(`/product/${productId}`);
    }

    if(reviewsLoading){
        return (
            <div className="my-reviews-menu">
                <div className="my-reviews-header">
                    <h2>My Reviews</h2>
                </div>
                <div className="reviews-container">
                    <Spinner />
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="my-reviews-menu">
                <div className="my-reviews-header">
                    <h2>My Reviews</h2>
                </div>
                {reviews && reviews.length > 0 ? (
                    <div className="reviews-container">
                        {reviews.map((review) => (
                            <div key={review?._id} className="review-item">
                                <div className="review-data">
                                    <div className="review-product">
                                        <img src={review?.product?.images[0]} onClick={() => handleImageClick(review?.product?._id)}></img>
                                        <div className="product-name">{review?.product?.name}</div>
                                    </div>
                                    <div className="review-content">
                                        <div className="review-info"> {review?.user?.name} </div>
                                      
                                        <p className="review-date">on: {formatDateTime(review?.createdAt)}</p>
                                        <div className="review-title">{review?.title}</div> 
                                        <div className="rating">
                                        {review?.rating && review?.rating > 0 &&  Array.from({length: review?.rating}, (_, i) => (
                                            <StarIcon key={i} style={{ color: "yellow" }} />
                                        ))}
                                        </div>
                                        <div className="review-content">
                                            <p>{review?.content}</p>
                                        </div>

                                    
                                    </div>
                                </div>
                                
                                {user?.role === 'admin' && (
                                <div className="review-actions">
                                    <DeleteIcon onClick={() => handleDeleteReview(review._id)}  />
                                       
                                </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>You didn't write any reviews :'</p>
                )}
            </div>
        </>
      );
}
export default MyReviewsMenu