import React,{useEffect, useState  } from "react";
import "./Filter.css";



const Filter = ({
  categories,
  availability,
  priceRange,
  selectedProductType,
  selectedBrand,
  handleFilterChange,
  setProducts,
  setLoading,
  filterProducts,
  brands,
}) => {
  
 
  console.log("brands",brands)
 

  const handleMinPriceChange = (e) => {
    const newMin = Number(e.target.value);
    if (newMin >= 0 && newMin <= priceRange[1] && newMin <= 300) {
      handleFilterChange("price", [newMin, priceRange[1]]);
    }
  };

  const handleMaxPriceChange = (e) => {
    const newMax = Number(e.target.value);
    if (newMax >= priceRange[0] && newMax <= 300) {
      handleFilterChange("price", [priceRange[0], newMax]);
    }
  };

  const handleMinSliderChange = (e) => {
    const newMin = Number(e.target.value);
    if (newMin <= priceRange[1]) {
      handleFilterChange("price", [newMin, priceRange[1]]);
    }
  };

  const handleMaxSliderChange = (e) => {
    const newMax = Number(e.target.value);
    if (newMax >= priceRange[0]) {
      handleFilterChange("price", [priceRange[0], newMax]);
    }
  };

  const handleApplyFilter = () => {
    const category = window.location.pathname.split("/")[2].replace(/-/g, " ");
    setLoading(true);
    filterProducts({
      availability,
      price: priceRange,
      category: category,
      brand: selectedBrand,
    });
    setLoading(false);

  };

  return (
    <div className="filter-section">
      
      <div className="filter-item">
        <div className="filter-availability">Availability</div>
        <div className="in-stock">
          <input
            type="checkbox"
            checked={availability.inStock}
            onChange={() =>
              handleFilterChange("availability", {
                inStock: !availability.inStock,
              })
            }
          />
          <div className="in-stock-title">In stock</div>
        </div>
        <div className="out-stock">
          <input
            type="checkbox"
            checked={availability.outOfStock}
            onChange={() =>
              handleFilterChange("availability", {
                outOfStock: !availability.outOfStock,
              })
            }
          />
          <div className="out-stock-title">Out of stock</div>
        </div>
      </div>

      <div className="filter-item">
        <div className="filter-price">Price</div>
        <div className="price-inputs">
          <input
            type="number"
            placeholder="Min"
            min="0"
            max="30"
            value={priceRange[0] > 0 ? priceRange[0] : ""}
            onChange={handleMinPriceChange}
            className="price-input"
          />
          <span> - </span>
          <input
            type="number"
            placeholder="Max"
            min="0"
            max="30"
            value={priceRange[1] > 0 ? priceRange[1] : ""}
            onChange={handleMaxPriceChange}
            className="price-input"
          />
        </div>
        <input
          type="range"
          min="0"
          max="30"
          value={priceRange[0]}
          onChange={handleMinSliderChange}
        />
        <input
          type="range"
          min="0"
          max="30"
          value={priceRange[1]}
          onChange={handleMaxSliderChange}
        />
        <div className="currency">
          $ {priceRange[0]} - $ {priceRange[1]}
        </div>
      </div>

      <div className="filter-item"></div>

      <div className="filter-item">
        <div className="filter-brand">Brand</div>
        {brands.map((brand) => (
          <div className="check-brand" key={brand}> 
            <input
              type="checkbox"
              checked={selectedBrand.includes(brand)}
              onChange={() => {
                const newSelection = selectedBrand.includes(brand)
                  ? selectedBrand.filter((b) => b !== brand)
                  : [...selectedBrand, brand];
                handleFilterChange("brand", newSelection);
              }}
            />
            <div className="brand-name">{brand}</div>
          </div>
        ))}
      </div>
      <button className="apply-button"
      onClick={handleApplyFilter}>Apply</button>
      
    </div>
  );
};

export default Filter;
