// Admin Routes
// Handles admin operations

const express = require('express');
const router = express.Router();
const {
  getUsers,
  getTasks,
  getStats,
  resetDatabase,
  seedDatabaseEndpoint,
  resetAndSeed
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

/**
 * @swagger
 * /api/admin/seed:
 *   post:
 *     summary: Seed database with initial data (Admin only)
 *     description: Populate database with categories, locations, and admin user if database is empty. Safe to run multiple times.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               force:
 *                 type: boolean
 *                 description: "If true, will clear existing data and reseed. Default is false"
 *                 example: false
 *     responses:
 *       200:
 *         description: Database seeded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Database seeding completed successfully!
 *                 results:
 *                   type: object
 *                   properties:
 *                     categories:
 *                       type: object
 *                       properties:
 *                         inserted:
 *                           type: number
 *                         skipped:
 *                           type: boolean
 *                     locations:
 *                       type: object
 *                       properties:
 *                         inserted:
 *                           type: number
 *                         skipped:
 *                           type: boolean
 *                     admin:
 *                       type: object
 *                       properties:
 *                         created:
 *                           type: boolean
 *                         skipped:
 *                           type: boolean
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.post('/seed', protect, admin, seedDatabaseEndpoint);

/**
 * @swagger
 * /api/admin/reset:
 *   post:
 *     summary: Reset database - Delete all data (Admin only)
 *     description: Permanently delete all data from all collections. Use with extreme caution!
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Database reset successfully
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.post('/reset', protect, admin, resetDatabase);

/**
 * @swagger
 * /api/admin/reset-and-seed:
 *   post:
 *     summary: Reset and seed database in one operation (Admin only)
 *     description: Delete all data and immediately seed with test data
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comprehensive:
 *                 type: boolean
 *                 description: "If true, uses comprehensive seed (users, tasks, messages, favorites). Default is false (basic seed)"
 *                 example: true
 *     responses:
 *       200:
 *         description: Database reset and seeded successfully
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.post('/reset-and-seed', protect, admin, resetAndSeed);

module.exports = router;











