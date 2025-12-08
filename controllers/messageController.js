// Message Controller
// Handles messaging between requesters and taskers

const Message = require('../models/Message');
const Task = require('../models/Task');
const User = require('../models/User');

/**
 * @route   POST /api/messages
 * @desc    Send a message
 * @access  Private
 */
const sendMessage = async (req, res) => {
  try {
    const { taskId, receiverId, content } = req.body;

    // Validate required fields
    if (!taskId || !receiverId || !content) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide taskId, receiverId, and content' 
      });
    }

    // Check if task exists
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ 
        success: false,
        message: 'Task not found' 
      });
    }

    // Check if receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ 
        success: false,
        message: 'Receiver not found' 
      });
    }

    // Create message
    const message = await Message.create({
      taskId,
      senderId: req.user._id,
      receiverId,
      content
    });

    // Populate sender and receiver details
    await message.populate([
      { path: 'sender', select: 'fullName email phone avatarUrl' },
      { path: 'receiver', select: 'fullName email phone avatarUrl' },
      { path: 'taskId', select: 'title' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: message
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Error sending message' 
    });
  }
};

/**
 * @route   GET /api/messages/conversations
 * @desc    Get list of conversations (unique task-user pairs)
 * @access  Private
 */
const getConversations = async (req, res) => {
  try {
    // Find all messages where user is sender or receiver
    const messages = await Message.find({
      $or: [
        { senderId: req.user._id },
        { receiverId: req.user._id }
      ]
    })
    .populate('taskId', 'title status')
    .populate('senderId', 'fullName avatarUrl')
    .populate('receiverId', 'fullName avatarUrl')
    .sort({ createdAt: -1 });

    // Group messages by task and other user
    const conversationsMap = new Map();
    
    messages.forEach(msg => {
      if (!msg.taskId) return; // Skip if task was deleted
      
      // Determine the other user (not the current user)
      const otherUserId = msg.senderId._id.toString() === req.user._id.toString() 
        ? msg.receiverId._id.toString()
        : msg.senderId._id.toString();
      
      const key = `${msg.taskId._id}-${otherUserId}`;
      
      // Only keep the most recent message for each conversation
      if (!conversationsMap.has(key)) {
        conversationsMap.set(key, {
          taskId: msg.taskId._id,
          taskTitle: msg.taskId.title,
          taskStatus: msg.taskId.status,
          otherUser: msg.senderId._id.toString() === req.user._id.toString() 
            ? msg.receiverId 
            : msg.senderId,
          lastMessage: msg.content,
          lastMessageTime: msg.createdAt,
          unreadCount: 0
        });
      }
    });

    // Count unread messages for each conversation
    for (const [key, conv] of conversationsMap.entries()) {
      const unreadCount = await Message.countDocuments({
        taskId: conv.taskId,
        senderId: conv.otherUser._id,
        receiverId: req.user._id,
        isRead: false
      });
      conv.unreadCount = unreadCount;
    }

    // Convert map to array
    const conversations = Array.from(conversationsMap.values());

    res.json({
      success: true,
      count: conversations.length,
      data: conversations
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching conversations' 
    });
  }
};

/**
 * @route   GET /api/messages/:taskId/:userId
 * @desc    Get conversation between current user and specific user about a task
 * @access  Private
 */
const getConversation = async (req, res) => {
  try {
    const { taskId, userId } = req.params;

    // Find messages between the two users about this task
    const messages = await Message.find({
      taskId,
      $or: [
        { senderId: req.user._id, receiverId: userId },
        { senderId: userId, receiverId: req.user._id }
      ]
    })
    .populate('sender', 'fullName email phone avatarUrl')
    .populate('receiver', 'fullName email phone avatarUrl')
    .sort({ createdAt: 1 }); // Oldest first for chat display

    // Mark received messages as read
    await Message.updateMany(
      {
        taskId,
        senderId: userId,
        receiverId: req.user._id,
        isRead: false
      },
      { isRead: true }
    );

    // Get task details
    const task = await Task.findById(taskId)
      .populate('requester', 'fullName email phone avatarUrl');

    res.json({
      success: true,
      count: messages.length,
      data: {
        messages,
        task
      }
    });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching conversation' 
    });
  }
};

/**
 * @route   PUT /api/messages/:id/read
 * @desc    Mark message as read
 * @access  Private
 */
const markAsRead = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ 
        success: false,
        message: 'Message not found' 
      });
    }

    // Only the receiver can mark as read
    if (message.receiverId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to mark this message as read' 
      });
    }

    message.isRead = true;
    await message.save();

    res.json({
      success: true,
      message: 'Message marked as read'
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error marking message as read' 
    });
  }
};

module.exports = {
  sendMessage,
  getConversations,
  getConversation,
  markAsRead
};












