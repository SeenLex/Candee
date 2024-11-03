import React from "react";
import './spinner.css';

const Spinner = () => {
    return(
        <div className="spinner">
            <div className="spinner-border">
                <img src="src/assets/Lemon.png" alt="spinner"></img>
                <img src="src/assets/strawberry.png" alt="spinner"></img>
                <img src="src/assets/orange.png" alt="spinner"></img>
            </div>
        </div>
    );
}
export default Spinner