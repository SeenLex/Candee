import React, { useState } from "react";
import "./review-modal.css";
import StarRating from "../../start-rating/star-rating";

const ReviewModal = ({onsubmit, isOpen, onClose}) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [rating, setRating] = useState(0);

    const handleSubmit = (e) => {
        e.preventDefault();

        onsubmit({title, content, rating});
        setTitle("");
        setContent("");
        setRating(0);

        onClose();
    }

    if(!isOpen){
        return null;
    }

    return(
        <div className="modal-container">
            <div className="modal-header">
                <h2>Your review</h2>
            </div>
            <div className="modal-body">
                <form onSubmit={handleSubmit}>
                    <div className="form-group-modal-review">
                        <div className="form-field">
                            <label>Title</label>
                            <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Review title">
                            </input>
                        </div>
                        <div className="form-field">
                            <label>Your message(optional, max. 500 characters)</label>
                            <textarea id="content" placeholder="Your message..." value={content} onChange={(e) => setContent(e.target.value)} maxLength={500}></textarea>
                        </div>
                        <div className="form-field-star">
                            <label>Your rating</label>
                            <StarRating rating={rating} setRating={setRating} />
                        </div>
                    </div>
                    <div className="review-modal-button-container">
                        <button type="submit">Submit</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
export default ReviewModal;