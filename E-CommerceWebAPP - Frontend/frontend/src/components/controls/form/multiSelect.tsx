import React, { useState, useCallback, useEffect } from 'react';

const MultiSelect = ({ categories, onCategoriesSelected, initialSelections }) => {

  const [selections, setSelections] = useState<Array<string>>([]);
 
  const [options, setOptions] = useState([categories]);

  const findCategoryById = useCallback((categories, id) => {
    for (const category of categories) {
      if (category._id === id) return category;
      if (category.children) {
        const found = findCategoryById(category.children, id);
        if (found) return found;
      }
    }
    return null;
  }, []);
  useEffect(() => {
    if (initialSelections.length) {
      const initialSelectionIds = initialSelections.map((category) => category._id);
      setSelections(initialSelectionIds);
      const newOptions = [categories];
      initialSelections.forEach((category, index) => {
        if (category.children) {
          newOptions.push(category.children);
        }
      });
      setOptions(newOptions);
    }
  }, [initialSelections, categories]);

  const handleSelectionChange = useCallback((level, selectedId) => {
    const newSelections = [...selections];
    newSelections[level] = selectedId;

    const truncatedSelections = newSelections.slice(0, level + 1);
    setSelections(truncatedSelections);

    const newOptions = options.slice(0, level + 1);
    const selectedCategory = findCategoryById(categories, selectedId);

    if (selectedCategory && selectedCategory.children) {
      newOptions.push(selectedCategory.children);
    }
    setOptions(newOptions);

    const selectedCategories = truncatedSelections.map(id => findCategoryById(categories, id));
    onCategoriesSelected(selectedCategories);
  }, [selections, options, categories, findCategoryById, onCategoriesSelected]);



  return (
    <div>
      {options.map((opts, level) => (
        <select
          key={level}
          value={selections[level] || ''}
          onChange={(e) => handleSelectionChange(level, e.target.value)}
        >
          <option value="" disabled>
            {level === 0 ? 'Select Category' : 'Select Subcategory'}
          </option>
          {opts.map((option) => (
            <option key={option._id} value={option._id}>
              {option.name}
            </option>
          ))}
        </select>
      ))}
    </div>
  );
};

export default MultiSelect;