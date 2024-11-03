import { Category } from "./CategoryType";
import { productData } from "./ProductType";

interface searchSuggestions{
   products: productData[];
    categories: Category[];
}

export type { searchSuggestions };