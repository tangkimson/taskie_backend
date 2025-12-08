// Category Routes
// Handles job categories

const express = require('express');
const router = express.Router();
const { getCategories } = require('../controllers/categoryController');

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all job categories
 *     description: Retrieve all available job categories (public endpoint)
 *     tags: [Categories]
 *     security: []
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 507f1f77bcf86cd799439012
 *                       name:
 *                         type: string
 *                         example: Moving & Delivery
 *                       icon:
 *                         type: string
 *                         example: 🚚
 */
router.get('/', getCategories);

module.exports = router;











