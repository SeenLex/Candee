import React, { useEffect } from 'react'
import { _get } from '../utils/api';
import { Category } from '../types/CategoryType';

interface UseCategoryResult {
    categories: Category[] | null;
    loading: boolean;
}


const useCategory = () : UseCategoryResult => {

    const [categories, setCategories] = React.useState<any[] | null>(null);
    const [loading, setLoading] = React.useState<boolean>(true);
    const fetchCategories = React.useCallback(async () => {
        setLoading(true);
        try {
            const response = await _get(`/categoriesTree`, {}, {});
          
            setCategories(response);
        } catch (error: any) {
            console.error("Error fetching all categories:", error);
        } finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        fetchCategories();
    }, []);


  return {categories, loading};
}

export default useCategory