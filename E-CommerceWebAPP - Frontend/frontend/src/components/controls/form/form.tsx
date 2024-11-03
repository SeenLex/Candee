import React from 'react';
import FormField from './form-field';
import './form.css';
import useCategory from '../../../hooks/useCategory';
import { Category } from '../../../types/CategoryType';

const Form = ({ fieldList, formData, setFormData, onSubmit, type }) => {
  const { categories, loading } = useCategory();
  
  const handleChange = (id) => (value) => {
    setFormData({ ...formData, [id]: value });
  };

  if (loading) {
    return <p>Loading...</p>
  }
  const initialCategoriesIds = formData.categories;
  const initialCategories = categories?.filter((category) => initialCategoriesIds?.includes(category._id));

    

  return (
    <form onSubmit={onSubmit} className="form-container">
      {fieldList.map((field) => (
        
        field &&
        <FormField
          key={field?.id}
          type={field?.type}
          label={field?.label}
          placeholder={field?.placeholder}
          value={formData[field?.id]}
          onChange={handleChange(field?.id)}
          icon={field?.icon}
          categories={categories as Category[]}
          initialSelections={type === 'edit-product' ? initialCategories : []}
        />
      ))}
      <button className="btn" type="submit">
        {type === 'edit-product' ? 'Update Product' : 'Submit'}
      </button>
    </form>
  );
};

export default Form;