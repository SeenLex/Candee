import React from "react";
import './info-cell.css';

interface InfoCellProps {
    title: string;
    content: any;
    displayEditButton?: boolean;
    handleEdit?: () => void;
    editControls?: React.ReactNode;
    type?: string;
    children?: React.ReactNode;
}

const InfoCell: React.FC<InfoCellProps> = ({title, content, displayEditButton = false, handleEdit, editControls, type, children}) => {
    if(type === "big"){
        return(
            <div className="info-cell-big">
                <h2>{title}</h2>
                <div>{content}</div>
                {displayEditButton && (
                    <button className="edit-info-button-big" onClick={handleEdit}>Edit</button>
                )}
                {editControls}
                {children}
            </div>
        );
    }
    return(
        <div className="info-cell">
            <h2>{title}</h2>
            <div className="info-cell-content">
                <div>{content}</div>
            </div>
            {displayEditButton && (
                <button className="edit-info-button" onClick={handleEdit}>Edit</button>
            )}
            {editControls}
            {children}
        </div>
    );
}
export default InfoCell;