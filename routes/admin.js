// Admin Routes
// Handles admin operations

const express = require('express');
const router = express.Router();
const {
  getUsers,
  getTasks,
  getStats
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     description: Retrieve all users in the system (requires admin role)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         description: Not authorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/users', protect, admin, getUsers);

/**
 * @swagger
 * /api/admin/tasks:
 *   get:
 *     summary: Get all tasks (Admin only)
 *     description: Retrieve all tasks in the system (requires admin role)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tasks retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 tasks:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 *       401:
 *         description: Not authorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/tasks', protect, admin, getTasks);

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Get system statistics (Admin only)
 *     description: Retrieve system statistics including user counts, task counts, etc. (requires admin role)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 stats:
 *                   type: object
 *                   properties:
 *                     totalUsers:
 *                       type: number
 *                       example: 150
 *                     totalRequesters:
 *                       type: number
 *                       example: 80
 *                     totalTaskers:
 *                       type: number
 *                       example: 70
 *                     totalTasks:
 *                       type: number
 *                       example: 200
 *                     openTasks:
 *                       type: number
 *                       example: 50
 *                     inProgressTasks:
 *                       type: number
 *                       example: 75
 *                     completedTasks:
 *                       type: number
 *                       example: 65
 *                     cancelledTasks:
 *                       type: number
 *                       example: 10
 *       401:
 *         description: Not authorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/stats', protect, admin, getStats);

module.exports = router;











