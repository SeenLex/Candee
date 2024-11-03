import React, { useEffect, useState } from "react";
import useProduct from "../../hooks/useProduct";
import useCategory from "../../hooks/useCategory";
import ProductCard from "../../components/product-card/product-card";
import Filter from "../../components/filter/Filter";
import "./CategoryPage.css";



const CategoryPage = () => {
  const { products, fetchProducts, loading, setLoading, setProducts, filterProducts } = useProduct(true);
  const { categories, loading: categoryLoading } = useCategory();
  type Category = {
    id: string;
    name: string;
  };
  const [brands, setBrands] = useState<string[]>([]);
  const getBrands = (products: any) => {
    const brands = products.map((product: any) => product.brand);
    return Array.from(new Set(brands));
  };
  useEffect(() => {
    if (products) {
      setBrands(getBrands(products));
    }
  }, [products]);



  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [availability, setAvailability] = useState({
    inStock: false,
    outOfStock: false,
  });
  const [priceRange, setPriceRange] = useState([0, 30]);
  const [selectedProductType, setSelectedProductType] = useState<string[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string[]>([]);

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category);
  };

  const handleFilterChange = (filterType: string, value: any) => {
    switch (filterType) {
      case "availability":
        if (value.inStock) {
          setAvailability({ inStock: true, outOfStock: false });
        } else if (value.outOfStock) {
          setAvailability({ inStock: false, outOfStock: true });
        } else {
          setAvailability({ inStock: false, outOfStock: false });
        }
        break;
      case "price":
        setPriceRange(value);
        break;
      case "productType":
        setSelectedProductType(value);
        break;
      case "brand":
        setSelectedBrand(value);
        break;
      default:
        break;
    }
  };

  return (
    <div className="category-page-container">
      <Filter
        categories={categories}
        availability={availability}
        priceRange={priceRange}
        selectedProductType={selectedProductType}
        selectedBrand={selectedBrand}
        handleFilterChange={handleFilterChange}
        setProducts={setProducts}
        setLoading={setLoading}
        filterProducts={filterProducts}
        brands={brands}
      />

      <div className="product-section">
        {selectedCategory && (
          <h2 className="category-title">{selectedCategory.name}</h2>
        )}
        {loading ? (
          <p>Loading products...</p>
        ) : (
          <div className="product-grid">
            {products?.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                loading={loading}
                isFavourite={false}
                onFavouriteToggle={() => {}}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
