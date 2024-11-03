import React, { useState, useEffect } from 'react';
import './searchBar.css';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import useSearch from '../../../hooks/useSearch';

const SearchBar = () => {

  const { searchInput, setSearchInput, suggestions, showDropdown, setShowDropdown, handleChange, handleSuggestionClick } = useSearch();


 

  return (
    <div className="search-bar-container">
      <div className={`search-input-wrapper ${showDropdown ? 'no-bottom-border' : ''}`}>
        <input
          type="text"
          placeholder="Search for products..."
          value={searchInput}
          onChange={handleChange}
          enterKeyHint="search"
        />
        {searchInput.length > 0 && <CloseIcon className="close-icon" onClick={() => setSearchInput('')} />}
        <SearchIcon className="search-icon" />
      </div>
      {showDropdown && (

        <div className="search-dropdown">
          {suggestions?.categories.map((category) => (
            <div key={category._id} onClick={() => handleSuggestionClick(category)} className="search-dropdown-item">
              <span className='search-dropdown-item-name'>Category: {category.name}</span>
            </div>
          ))}
          {suggestions?.products.map((product) => (
            <div key={product?._id} onClick={() => handleSuggestionClick(product)} className="search-dropdown-item">
              <img src={ product?.images[0] }
                alt={product?.name} className='search-dropdown-item-image' />
               <span className='search-dropdown-item-name'>{product?.name}</span>

            </div>
          ))}
          {
            suggestions?.categories.length === 0 && suggestions?.products.length === 0 && (
              <div className="no-results">No results found</div>
            )
          }
        </div> 
       

      )}
    </div>
  );
};

export default SearchBar;
