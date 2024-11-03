const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { verifyToken, verifyTokenAndAdmin } = require('../middleware/verifyToken');

router.post('/categories/add',verifyTokenAndAdmin, categoryController.createCategory);
router.put('/categories/:id',verifyTokenAndAdmin, categoryController.updateCategory);
router.delete('/categories/:id',verifyTokenAndAdmin, categoryController.deleteCategory);
router.get('/categories', categoryController.getAllCategories);
router.get('/categories/:id', categoryController.getCategoryById);
router.get('/categories/:id/subcategories', categoryController.getSubcategories);
router.get('/categoriesTree', categoryController.getCategoryTree);

module.exports = router;    