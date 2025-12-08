// Location Routes
// Handles locations

const express = require('express');
const router = express.Router();
const { getLocations } = require('../controllers/locationController');

/**
 * @swagger
 * /api/locations:
 *   get:
 *     summary: Get all locations
 *     description: Retrieve all available locations (public endpoint)
 *     tags: [Locations]
 *     security: []
 *     responses:
 *       200:
 *         description: Locations retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 locations:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 507f1f77bcf86cd799439013
 *                       name:
 *                         type: string
 *                         example: Hanoi
 */
router.get('/', getLocations);

module.exports = router;











