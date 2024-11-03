import React, { useEffect, useState } from "react";
import "./reviews-submenu.css";
import StarIcon from "@mui/icons-material/Star";
import {formatDateTime} from "../../../utils/formatDataTime.ts";
import ReviewModal from "../../modals/review-modal/review-modal.tsx";
import useReview from "../../../hooks/useReview.tsx";
import { postReviewData } from "../../../types/ReviewType.ts";
import Spinner from "../../spinner/spinner.tsx";

const ReviewsSubmenu = ({productId, token, reviewRef, user}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const {reviews, loading, fetchReviewsByProduct, createReview} = useReview(token, productId);
    
    useEffect(() => {
      fetchReviewsByProduct(productId);
    }, [fetchReviewsByProduct, productId]);

    const handleAddReview = async (review: {title: string; content: string; rating: number}) => {
      const newReview: postReviewData = {
        ...review,
        productId: productId,
        userId: user.id
      };
      await createReview(newReview);
    };

    return(
        <div className="product-reviews-container">
          <div className="product-reviews-header" ref={reviewRef}>
            <h1>Buyer's reviews ({reviews?.length || "0"})</h1>
            <button className='add' onClick={() => setIsModalOpen(true)}>Add a review</button>
          </div>
          <div className="review-cells-container">
            {loading && <Spinner />}
            {reviews && reviews.map((review) => (
              <div key={review._id} className="review-cell">
                <div className="left-review-cell">
                  <h3>{review.title}</h3>
                  <p>{review.content}</p>
                </div>
                <div className="right-review-cell">
                  <div className="review-rating-container">
                    <h3>{review.rating}</h3>
                    <StarIcon style={{ color: "yellow" }} />
                  </div>
                  <p> on: {formatDateTime(review.createdAt)}</p>
                  <p> by: {review.user.name || user?.name} </p>
                </div>
              </div>
            ))} 
            {reviews && reviews.length === 0 && !loading && <div className="no-reviews">No reviews yet</div>}
          </div>
          <ReviewModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onsubmit={handleAddReview}></ReviewModal>
        </div>
    );
}
export default ReviewsSubmenu;