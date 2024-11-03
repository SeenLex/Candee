import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useCategory from "../../hooks/useCategory";
import "./dropdown.css";

const Dropdown = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { categories, loading } = useCategory();
  const navigate = useNavigate();
  
  let timeoutId: NodeJS.Timeout;

  const handleMouseEnter = (key: string) => {
    clearTimeout(timeoutId);
    setOpenDropdown(key);
  };

  const handleMouseLeave = () => {
    timeoutId = setTimeout(() => {
      setOpenDropdown(null);
    }, 300);
  };

  const handleOptionClick = (option: string) => {
    navigate(`/category/${option.replace(/ /g, "-")}`);
    setOpenDropdown(null);

  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const renderSubcategories = (subcategories: any[]) => {
    return subcategories.map((subCategory) => (
      <div key={subCategory._id} className="dropdown-subcategory">
        <div
          className="dropdown-item"
          onClick={() => handleOptionClick(subCategory.name)}
          role="button"
          tabIndex={0}
        >
          {subCategory.name}
        </div>
      </div>
    ));
  };

  return (
    <div className="sweet-categories" ref={dropdownRef}>
      <div className="categories-container">
        {categories?.map((category) => (
          <div
            key={category._id}
            className="dropdown-category"
            onMouseEnter={() => handleMouseEnter(category._id)}
            onMouseLeave={handleMouseLeave}
          >
            <div className="dropdown-toggle">{category.name}</div>
            {category.children && (
              <div
                className={`dropdown-menu ${
                  openDropdown === category._id ? "show" : ""
                }`}
              >
                {renderSubcategories(category.children)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dropdown;
