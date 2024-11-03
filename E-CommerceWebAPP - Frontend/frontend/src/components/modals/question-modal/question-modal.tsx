import React, { useState } from "react";


const QuestionModal = ({onSubmit, isOpen, onClose}) => {
    const [content, setContent] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        onSubmit({content});
        setContent("");

        onClose();
    }

    if(!isOpen){
        return null;
    }

    return(
        <div className="modal-container">
            <div className="modal-header">
                <h2>Your question</h2>
            </div>
            <div className="modal-body">
                <form onSubmit={handleSubmit}>
                    <div className="form-group-modal-review">
                        <div className="form-field">
                            <label>Your question</label>
                            <textarea id="content" placeholder="Your question..." value={content} onChange={(e) => setContent(e.target.value)} required maxLength={500}></textarea>
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
};
export default QuestionModal;