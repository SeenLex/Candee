const Category = require('../models/Category');
const Product = require('../models/Product');

exports.createCategory = async (req, res) => {
    try {
        const { name, parentId } = req.body;
        let level = 0;
        let parent = null;

        if (parentId) {
            parent = await Category.findById(parentId);
            if (!parent) {
                return res.status(404).json({ message: 'Parent category not found' });
            }
            level = parent.level + 1;
        }

        const newCategory = new Category({
            name,
            parent: parentId || null,
            level
        });

        const savedCategory = await newCategory.save();
        // Populate the parent field before sending the response
        await savedCategory.populate('parent');
        res.status(201).json(savedCategory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find().populate('parent');
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id).populate('parent');
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const { name, parentId } = req.body;
        let updateData = { name };

        if (parentId !== undefined) {
            if (parentId === null) {
                updateData.parent = null;
                updateData.level = 0;
            } else {
                const parentCategory = await Category.findById(parentId);
                if (!parentCategory) {
                    return res.status(404).json({ message: 'Parent category not found' });
                }
                updateData.parent = parentId;
                updateData.level = parentCategory.level + 1;
            }
        }

        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        ).populate('parent');

        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.json(updatedCategory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

       
        const childrenCategories = await Category.find({ parent: req.params.id });
        if (childrenCategories.length > 0) {
            return res.status(400).json({ message: 'Cannot delete category with subcategories' });
        }

        
        const productsUsingCategory = await Product.find({ categories: req.params.id });
        if (productsUsingCategory.length > 0) {
            return res.status(400).json({ message: 'Cannot delete category used in products' });
        }

        await Category.findByIdAndDelete(req.params.id);
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getSubcategories = async (req, res) => {
    try {
        const subcategories = await Category.find({ parent: req.params.id }).populate('parent');
        res.json(subcategories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCategoryTree = async (req, res) => {
    try {
        const categories = await Category.find();
        const categoryTree = buildCategoryTree(categories);
        res.json(categoryTree);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

function buildCategoryTree(categories, parentId = null) {
    const categoryTree = categories
        .filter(category => 
            parentId === null 
                ? category.parent === null 
                : category.parent && category.parent._id.toString() === parentId
        )
        .map(category => ({
            _id: category._id,
            name: category.name,
            level: category.level,
            parent: category.parent,
            children: buildCategoryTree(categories, category._id.toString())
        }));

    return categoryTree.length > 0 ? categoryTree : null;
}