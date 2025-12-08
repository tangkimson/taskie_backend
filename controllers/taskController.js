// Task Controller
// Handles task operations (create, read, update, delete, search)

const Task = require('../models/Task');
const JobCategory = require('../models/JobCategory');
const User = require('../models/User');

/**
 * @route   POST /api/tasks
 * @desc    Create a new task
 * @access  Private (Requester only)
 */
const createTask = async (req, res) => {
  try {
    const { title, description, category, location, price, deadline } = req.body;

    // Validate required fields (location is validated after parsing below)
    if (!title || !description || !category || !price || !deadline) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide all required fields' 
      });
    }

    // Parse location if it was sent as a JSON string via multipart/form-data
    let parsedLocation = location;
    if (typeof parsedLocation === 'string') {
      try {
        parsedLocation = JSON.parse(parsedLocation);
      } catch (parseError) {
        return res.status(400).json({
          success: false,
          message: 'Invalid location format. Please select province and ward again.'
        });
      }
    }

    // Validate location structure
    if (
      !parsedLocation ||
      typeof parsedLocation !== 'object' ||
      !parsedLocation.province ||
      !parsedLocation.ward
    ) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide both province and ward' 
      });
    }

    const numericPrice = Number(price);
    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid price'
      });
    }

    // Check if at least 2 images are uploaded
    if (!req.files || req.files.length < 2) {
      return res.status(400).json({ 
        success: false,
        message: 'Please upload at least 2 images of the task' 
      });
    }

    // Get posting fee from job category
    const jobCategory = await JobCategory.findOne({ name: category });
    if (!jobCategory) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid job category' 
      });
    }

    // Build image URLs array
    const images = req.files.map(file => `/uploads/tasks/${file.filename}`);

    // Create task
    const task = await Task.create({
      title,
      description,
      category,
      location: parsedLocation,
      price: numericPrice,
      deadline,
      postingFee: jobCategory.postingFee,
      images,
      requesterId: req.user._id
    });

    // Populate requester details
    await task.populate('requester', 'fullName email phone avatarUrl');

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Error creating task' 
    });
  }
};

/**
 * @route   GET /api/tasks/my
 * @desc    Get tasks created by logged-in requester
 * @access  Private (Requester only)
 */
const getMyTasks = async (req, res) => {
  try {
    const { status } = req.query;

    // Build query
    const query = { requesterId: req.user._id };
    
    // Add status filter if provided
    if (status && status !== 'all') {
      query.status = status;
    }

    // Find tasks
    const tasks = await Task.find(query)
      .populate('requester', 'fullName email phone avatarUrl')
      .sort({ createdAt: -1 }); // Sort by newest first

    res.json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    console.error('Get my tasks error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching tasks' 
    });
  }
};

/**
 * @route   GET /api/tasks/search
 * @desc    Search and filter tasks (for taskers)
 * @access  Private
 */
const searchTasks = async (req, res) => {
  try {
    const { keyword, category, province, ward, minPrice, maxPrice } = req.query;

    // Build query (only show pending tasks)
    const query = { status: 'pending' };

    // Add keyword search (search in title and description)
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ];
    }

    // Add category filter
    if (category) {
      query.category = category;
    }

    // Add location filters
    if (province) {
      query['location.province'] = province;
    }
    if (ward) {
      query['location.ward'] = ward;
    }

    // Add price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Find tasks
    const tasks = await Task.find(query)
      .populate('requester', 'fullName email phone avatarUrl')
      .sort({ createdAt: -1 }); // Sort by newest first

    res.json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    console.error('Search tasks error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error searching tasks' 
    });
  }
};

/**
 * @route   GET /api/tasks/:id
 * @desc    Get single task by ID
 * @access  Private
 */
const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('requester', 'fullName email phone avatarUrl');

    if (!task) {
      return res.status(404).json({ 
        success: false,
        message: 'Task not found' 
      });
    }

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching task' 
    });
  }
};

/**
 * @route   PUT /api/tasks/:id
 * @desc    Update task (only description and price - title cannot be changed for security)
 * @access  Private (Requester only, own tasks)
 */
const updateTask = async (req, res) => {
  try {
    const { description, price } = req.body;

    // Find task
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ 
        success: false,
        message: 'Task not found' 
      });
    }

    // Check if user owns this task
    if (task.requesterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to update this task' 
      });
    }

    // Prevent editing if task is already completed
    if (task.status === 'completed') {
      return res.status(400).json({ 
        success: false,
        message: 'Cannot edit a completed task' 
      });
    }

    // Update allowed fields (title cannot be changed for security reasons)
    if (description) task.description = description;
    if (price !== undefined) task.price = price;

    await task.save();

    // Populate and return updated task
    await task.populate('requester', 'fullName email phone avatarUrl');

    res.json({
      success: true,
      message: 'Task updated successfully',
      data: task
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Error updating task' 
    });
  }
};

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete task
 * @access  Private (Requester only, own tasks)
 */
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ 
        success: false,
        message: 'Task not found' 
      });
    }

    // Check if user owns this task
    if (task.requesterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to delete this task' 
      });
    }

    await task.deleteOne();

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error deleting task' 
    });
  }
};

/**
 * @route   POST /api/tasks/:id/payment-proof
 * @desc    Upload payment proof for task
 * @access  Private (Requester only, own tasks)
 */
const uploadPaymentProof = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: 'Please upload a payment proof image' 
      });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ 
        success: false,
        message: 'Task not found' 
      });
    }

    // Check if user owns this task
    if (task.requesterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to update this task' 
      });
    }

    // Update payment proof URL (automatically approved)
    task.paymentProofUrl = `/uploads/payments/${req.file.filename}`;
    await task.save();

    res.json({
      success: true,
      message: 'Payment proof uploaded and approved successfully',
      data: {
        paymentProofUrl: task.paymentProofUrl
      }
    });
  } catch (error) {
    console.error('Upload payment proof error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error uploading payment proof' 
    });
  }
};

/**
 * @route   PUT /api/tasks/:id/status
 * @desc    Update task status (Requester only)
 * @access  Private (Requester only, own tasks)
 */
const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ 
        success: false,
        message: 'Task not found' 
      });
    }

    // Check if user owns this task
    if (task.requesterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to update this task' 
      });
    }

    // Validate status
    const validStatuses = ['pending', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid status value' 
      });
    }

    // Update task status
    task.status = status;
    await task.save();

    // Populate and return updated task
    await task.populate('requester', 'fullName email phone avatarUrl');

    res.json({
      success: true,
      message: `Task status updated to ${status} successfully`,
      data: task
    });
  } catch (error) {
    console.error('Update task status error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Error updating task status' 
    });
  }
};

/**
 * @route   PUT /api/tasks/:id/complete
 * @desc    Mark task as completed (Requester only)
 * @access  Private (Requester only, own tasks)
 */
const completeTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ 
        success: false,
        message: 'Task not found' 
      });
    }

    // Check if user owns this task
    if (task.requesterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to complete this task' 
      });
    }

    // Only allow completing tasks that are pending
    if (task.status !== 'pending') {
      return res.status(400).json({ 
        success: false,
        message: 'Only pending tasks can be marked as completed' 
      });
    }

    // Update task status to completed
    task.status = 'completed';
    await task.save();

    // Populate and return updated task
    await task.populate('requester', 'fullName email phone avatarUrl');

    res.json({
      success: true,
      message: 'Task marked as completed successfully',
      data: task
    });
  } catch (error) {
    console.error('Complete task error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Error completing task' 
    });
  }
};

module.exports = {
  createTask,
  getMyTasks,
  searchTasks,
  getTask,
  updateTask,
  deleteTask,
  uploadPaymentProof,
  updateTaskStatus,
  completeTask
};

