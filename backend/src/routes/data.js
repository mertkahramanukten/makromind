const express = require('express');
const { body, validationResult, param, query } = require('express-validator');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Sample data model (replace with your actual data model)
const sampleData = [
  {
    id: 1,
    title: 'Sample Data 1',
    description: 'This is a sample data item',
    category: 'general',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 2,
    title: 'Sample Data 2',
    description: 'Another sample data item',
    category: 'important',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// @route   GET /api/data
// @desc    Get all data items (with pagination and filtering)
// @access  Public (with optional auth for additional features)
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('category').optional().isString().withMessage('Category must be a string'),
  query('search').optional().isString().withMessage('Search must be a string'),
  optionalAuth
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;
    const search = req.query.search;

    // Filter data based on query parameters
    let filteredData = [...sampleData];

    if (category) {
      filteredData = filteredData.filter(item => item.category === category);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredData = filteredData.filter(item => 
        item.title.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower)
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    const total = filteredData.length;
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        items: paginatedData,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: total,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        },
        filters: {
          category: category || null,
          search: search || null
        }
      }
    });

  } catch (error) {
    console.error('Get data error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/data/:id
// @desc    Get data item by ID
// @access  Public
router.get('/:id', [
  param('id').isInt({ min: 1 }).withMessage('ID must be a positive integer'),
  optionalAuth
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const item = sampleData.find(item => item.id === parseInt(id));

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Data item not found'
      });
    }

    res.json({
      success: true,
      data: { item }
    });

  } catch (error) {
    console.error('Get data item error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   POST /api/data
// @desc    Create new data item
// @access  Private
router.post('/', [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title is required and must be less than 200 characters'),
  body('description')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Description is required and must be less than 1000 characters'),
  body('category')
    .optional()
    .isIn(['general', 'important', 'urgent'])
    .withMessage('Category must be one of: general, important, urgent'),
  authenticateToken
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { title, description, category = 'general' } = req.body;

    // Generate new ID
    const newId = Math.max(...sampleData.map(item => item.id)) + 1;

    const newItem = {
      id: newId,
      title,
      description,
      category,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: req.user._id
    };

    sampleData.push(newItem);

    res.status(201).json({
      success: true,
      message: 'Data item created successfully',
      data: { item: newItem }
    });

  } catch (error) {
    console.error('Create data item error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   PUT /api/data/:id
// @desc    Update data item
// @access  Private
router.put('/:id', [
  param('id').isInt({ min: 1 }).withMessage('ID must be a positive integer'),
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be less than 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  body('category')
    .optional()
    .isIn(['general', 'important', 'urgent'])
    .withMessage('Category must be one of: general, important, urgent'),
  authenticateToken
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const itemIndex = sampleData.findIndex(item => item.id === parseInt(id));

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Data item not found'
      });
    }

    // Check if user owns the item or is admin
    if (sampleData[itemIndex].createdBy !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const { title, description, category } = req.body;
    const updateData = {};

    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (category) updateData.category = category;

    updateData.updatedAt = new Date();

    Object.assign(sampleData[itemIndex], updateData);

    res.json({
      success: true,
      message: 'Data item updated successfully',
      data: { item: sampleData[itemIndex] }
    });

  } catch (error) {
    console.error('Update data item error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   DELETE /api/data/:id
// @desc    Delete data item
// @access  Private
router.delete('/:id', [
  param('id').isInt({ min: 1 }).withMessage('ID must be a positive integer'),
  authenticateToken
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const itemIndex = sampleData.findIndex(item => item.id === parseInt(id));

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Data item not found'
      });
    }

    // Check if user owns the item or is admin
    if (sampleData[itemIndex].createdBy !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    sampleData.splice(itemIndex, 1);

    res.json({
      success: true,
      message: 'Data item deleted successfully'
    });

  } catch (error) {
    console.error('Delete data item error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/data/categories
// @desc    Get available categories
// @access  Public
router.get('/categories', (req, res) => {
  const categories = [
    { value: 'general', label: 'General' },
    { value: 'important', label: 'Important' },
    { value: 'urgent', label: 'Urgent' }
  ];

  res.json({
    success: true,
    data: { categories }
  });
});

module.exports = router;
