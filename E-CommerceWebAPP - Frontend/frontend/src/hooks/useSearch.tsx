import { useCallback, useEffect, useState } from "react";
import { _get, _post,_delete } from "../utils/api";
import { searchSuggestions } from "../types/SearchSuggestionType";
import { useNavigate } from "react-router-dom";
import { productData } from "../types/ProductType";
import { Category } from "../types/CategoryType";


interface useSearchResult{
    searchInput: string;
    setSearchInput: React.Dispatch<React.SetStateAction<string>>;
    suggestions: searchSuggestions;
    showDropdown: boolean;
    setShowDropdown: React.Dispatch<React.SetStateAction<boolean>>;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSuggestionClick: (suggestion: productData | Category) => void;
}

const useSearch = (): useSearchResult => {
    const [searchInput, setSearchInput] = useState('');
    const [suggestions, setSuggestions] = useState<searchSuggestions>({products:[],categories:[]});
    const [showDropdown, setShowDropdown] = useState(false);

    const navigate = useNavigate();

    const fetchSuggestions = useCallback(async (searchInput: string) => {
        const response = await _get(`/products/search?q=${searchInput}`,{},{});
        const products = response.products;
        const categories = response.categories;
        const suggestionsResponse = { products, categories };
        setSuggestions(suggestionsResponse);
        

        
    }, []);

    useEffect(() => {
        if (searchInput.length > 0) {
            fetchSuggestions(searchInput);
            setShowDropdown(true);
        } else {
            setShowDropdown(false);
        }

        
    }, [searchInput,fetchSuggestions]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const value = e.target.value;
        setSearchInput(value);
    };

    const handleSuggestionClick = (suggestion: productData | Category) => {
       
        setSearchInput('');
        setShowDropdown(false);

        if ('categories' in suggestion) {
            navigate(`/product/${suggestion._id}`);
            return;
        }
        navigate(`/category/${suggestion._id}`);
    };

    return { searchInput, setSearchInput, suggestions, showDropdown, setShowDropdown, handleChange, handleSuggestionClick };
}
   

export default useSearch;