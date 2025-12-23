// Comprehensive Seed Data Utility
// Creates realistic test data covering all application features
// This extends the basic seedData.js with users, tasks, messages, and favorites

const JobCategory = require('../models/JobCategory');
const Location = require('../models/Location');
const User = require('../models/User');
const Task = require('../models/Task');
const Message = require('../models/Message');
const Favorite = require('../models/Favorite');
const bcrypt = require('bcryptjs');

/**
 * Create comprehensive test users
 */
const createTestUsers = async () => {
  console.log('👥 Creating test users...');
  
  const users = [];
  const defaultPasswordPlain = 'password123';

  // Admin user
  let admin = await User.findOne({ email: 'admin@taskie.com' });
  if (!admin) {
    admin = await User.create({
      fullName: 'Admin User',
      dateOfBirth: new Date('1990-01-01'),
      email: 'admin@taskie.com',
      password: defaultPasswordPlain, // Will be hashed by pre-save hook
      currentRole: 'admin'
    });
  } else {
    admin.fullName = 'Admin User';
    admin.dateOfBirth = new Date('1990-01-01');
    admin.password = defaultPasswordPlain; // Will be hashed by pre-save hook
    admin.currentRole = 'admin';
    await admin.save();
  }
  users.push(admin);
  console.log('   ✅ Admin user created/updated');

  // Requesters (people who post tasks)
  const requesters = [
    {
      fullName: 'Nguyễn Văn An',
      dateOfBirth: new Date('1985-05-15'),
      email: 'requester1@taskie.com',
      phone: '0912345678',
      password: defaultPasswordPlain,
      currentRole: 'requester',
      avatarUrl: null
    },
    {
      fullName: 'Trần Thị Bình',
      dateOfBirth: new Date('1992-08-20'),
      email: 'requester2@taskie.com',
      phone: '0923456789',
      password: defaultPasswordPlain,
      currentRole: 'requester',
      avatarUrl: null
    },
    {
      fullName: 'Lê Văn Cường',
      dateOfBirth: new Date('1988-03-10'),
      email: 'requester3@taskie.com',
      phone: '0934567890',
      password: defaultPasswordPlain,
      currentRole: 'requester',
      avatarUrl: null
    },
    {
      fullName: 'Phạm Thị Dung',
      dateOfBirth: new Date('1995-11-25'),
      email: 'requester4@taskie.com',
      phone: '0945678901',
      password: defaultPasswordPlain,
      currentRole: 'requester',
      avatarUrl: null
    },
    {
      fullName: 'Hoàng Văn Em',
      dateOfBirth: new Date('1990-07-12'),
      email: 'requester5@taskie.com',
      phone: '0956789012',
      password: defaultPasswordPlain,
      currentRole: 'requester',
      avatarUrl: null
    }
  ];

  for (const requesterData of requesters) {
    let requester = await User.findOne({ email: requesterData.email });
    if (!requester) {
      requester = await User.create({
        ...requesterData,
        password: defaultPasswordPlain // Will be hashed by pre-save hook
      });
    } else {
      Object.assign(requester, requesterData);
      requester.password = defaultPasswordPlain; // Will be hashed by pre-save hook
      await requester.save();
    }
    users.push(requester);
  }
  console.log(`   ✅ Created ${requesters.length} requester users`);

  // Taskers (people who do tasks)
  const taskers = [
    {
      fullName: 'Nguyễn Thị Phương',
      dateOfBirth: new Date('1993-04-18'),
      email: 'tasker1@taskie.com',
      phone: '0967890123',
      password: defaultPasswordPlain,
      currentRole: 'tasker',
      avatarUrl: null,
      proofOfExperienceUrl: null
    },
    {
      fullName: 'Trần Văn Hùng',
      dateOfBirth: new Date('1987-09-30'),
      email: 'tasker2@taskie.com',
      phone: '0978901234',
      password: defaultPasswordPlain,
      currentRole: 'tasker',
      avatarUrl: null,
      proofOfExperienceUrl: null
    },
    {
      fullName: 'Lê Thị Mai',
      dateOfBirth: new Date('1994-12-05'),
      email: 'tasker3@taskie.com',
      phone: '0989012345',
      password: defaultPasswordPlain,
      currentRole: 'tasker',
      avatarUrl: null,
      proofOfExperienceUrl: null
    },
    {
      fullName: 'Phạm Văn Nam',
      dateOfBirth: new Date('1991-06-22'),
      email: 'tasker4@taskie.com',
      phone: '0990123456',
      password: defaultPasswordPlain,
      currentRole: 'tasker',
      avatarUrl: null,
      proofOfExperienceUrl: null
    },
    {
      fullName: 'Hoàng Thị Oanh',
      dateOfBirth: new Date('1989-02-14'),
      email: 'tasker5@taskie.com',
      phone: '0901234567',
      password: defaultPasswordPlain,
      currentRole: 'tasker',
      avatarUrl: null,
      proofOfExperienceUrl: null
    }
  ];

  for (const taskerData of taskers) {
    let tasker = await User.findOne({ email: taskerData.email });
    if (!tasker) {
      tasker = await User.create({
        ...taskerData,
        password: defaultPasswordPlain // Will be hashed by pre-save hook
      });
    } else {
      Object.assign(tasker, taskerData);
      tasker.password = defaultPasswordPlain; // Will be hashed by pre-save hook
      await tasker.save();
    }
    users.push(tasker);
  }
  console.log(`   ✅ Created ${taskers.length} tasker users`);

  return users;
};

/**
 * Create comprehensive test tasks
 */
const createTestTasks = async (users) => {
  console.log('📋 Creating test tasks...');
  
  const requesters = users.filter(u => u.currentRole === 'requester');
  const categories = await JobCategory.find();
  const locations = await Location.find();

  if (requesters.length === 0 || categories.length === 0 || locations.length === 0) {
    console.log('   ⚠️  Cannot create tasks: missing requesters, categories, or locations');
    return [];
  }

  // Get some sample locations
  const hueLocation = locations.find(l => l.province === 'Thành phố Huế');
  const halongLocation = locations.find(l => l.province === 'Thành phố Hạ Long');
  const mongcaiLocation = locations.find(l => l.province === 'Thành phố Móng Cái');

  const tasks = [];

  // Task 1: Pending task with payment proof (Assembly)
  const task1 = await Task.create({
    title: 'Lắp ráp bàn ghế IKEA',
    description: 'Cần người lắp ráp bộ bàn ghế IKEA tại nhà. Đã có đầy đủ dụng cụ và hướng dẫn. Cần hoàn thành trong 2 ngày.',
    category: categories.find(c => c.name === 'Lắp ráp đồ dùng')?.name || categories[0].name,
    images: ['/uploads/tasks/sample-task-1.jpg', '/uploads/tasks/sample-task-2.jpg'],
    location: {
      province: hueLocation?.province || locations[0].province,
      ward: hueLocation?.wards[0] || locations[0].wards[0]
    },
    price: 200000,
    postingFee: categories.find(c => c.name === 'Lắp ráp đồ dùng')?.postingFee || 10000,
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    paymentProofUrl: '/uploads/payments/sample-payment-1.jpg',
    status: 'pending',
    requesterId: requesters[0]._id
  });
  tasks.push(task1);

  // Task 2: Pending task without payment proof (Repair)
  const task2 = await Task.create({
    title: 'Sửa chữa máy lạnh không hoạt động',
    description: 'Máy lạnh nhà tôi không lạnh, cần thợ có kinh nghiệm kiểm tra và sửa chữa. Máy đã dùng được 3 năm.',
    category: categories.find(c => c.name === 'Sửa chữa')?.name || categories[1].name,
    images: ['/uploads/tasks/sample-task-3.jpg', '/uploads/tasks/sample-task-4.jpg'],
    location: {
      province: halongLocation?.province || locations[0].province,
      ward: halongLocation?.wards[0] || locations[0].wards[0]
    },
    price: 500000,
    postingFee: categories.find(c => c.name === 'Sửa chữa')?.postingFee || 15000,
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    paymentProofUrl: null,
    status: 'pending',
    requesterId: requesters[1]._id
  });
  tasks.push(task2);

  // Task 3: Completed task (Delivery)
  const task3 = await Task.create({
    title: 'Giao hàng từ siêu thị về nhà',
    description: 'Cần giao hàng từ siêu thị Coopmart về nhà. Khoảng cách 5km. Hàng nặng khoảng 20kg.',
    category: categories.find(c => c.name === 'Giao hàng')?.name || categories[2].name,
    images: ['/uploads/tasks/sample-task-5.jpg', '/uploads/tasks/sample-task-6.jpg'],
    location: {
      province: mongcaiLocation?.province || locations[0].province,
      ward: mongcaiLocation?.wards[0] || locations[0].wards[0]
    },
    price: 100000,
    postingFee: categories.find(c => c.name === 'Giao hàng')?.postingFee || 5000,
    deadline: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    paymentProofUrl: '/uploads/payments/sample-payment-2.jpg',
    status: 'completed',
    requesterId: requesters[2]._id
  });
  tasks.push(task3);

  // Task 4: Pending task (Cleaning)
  const task4 = await Task.create({
    title: 'Vệ sinh nhà cửa cuối tuần',
    description: 'Cần người vệ sinh nhà 2 tầng, diện tích 100m2. Bao gồm quét dọn, lau nhà, vệ sinh phòng tắm và bếp.',
    category: categories.find(c => c.name === 'Vệ sinh')?.name || categories[3].name,
    images: ['/uploads/tasks/sample-task-7.jpg', '/uploads/tasks/sample-task-8.jpg'],
    location: {
      province: hueLocation?.province || locations[0].province,
      ward: hueLocation?.wards[1] || locations[0].wards[1]
    },
    price: 300000,
    postingFee: categories.find(c => c.name === 'Vệ sinh')?.postingFee || 8000,
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    paymentProofUrl: '/uploads/payments/sample-payment-3.jpg',
    status: 'pending',
    requesterId: requesters[0]._id
  });
  tasks.push(task4);

  // Task 5: Pending task (Moving)
  const task5 = await Task.create({
    title: 'Chuyển nhà từ quận 1 sang quận 7',
    description: 'Cần đội ngũ chuyển nhà. Có đồ đạc lớn như tủ lạnh, máy giặt. Cần xe tải và 2-3 người.',
    category: categories.find(c => c.name === 'Chuyển nhà')?.name || categories[4].name,
    images: ['/uploads/tasks/sample-task-9.jpg', '/uploads/tasks/sample-task-10.jpg'],
    location: {
      province: halongLocation?.province || locations[0].province,
      ward: halongLocation?.wards[1] || locations[0].wards[1]
    },
    price: 1500000,
    postingFee: categories.find(c => c.name === 'Chuyển nhà')?.postingFee || 20000,
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    paymentProofUrl: null,
    status: 'pending',
    requesterId: requesters[3]._id
  });
  tasks.push(task5);

  // Task 6: Pending task (Gardening)
  const task6 = await Task.create({
    title: 'Làm vườn và cắt tỉa cây cảnh',
    description: 'Cần người có kinh nghiệm làm vườn để cắt tỉa cây cảnh, nhổ cỏ, và chăm sóc vườn hoa.',
    category: categories.find(c => c.name === 'Làm vườn')?.name || categories[5].name,
    images: ['/uploads/tasks/sample-task-11.jpg', '/uploads/tasks/sample-task-12.jpg'],
    location: {
      province: mongcaiLocation?.province || locations[0].province,
      ward: mongcaiLocation?.wards[1] || locations[0].wards[1]
    },
    price: 250000,
    postingFee: categories.find(c => c.name === 'Làm vườn')?.postingFee || 12000,
    deadline: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
    paymentProofUrl: '/uploads/payments/sample-payment-4.jpg',
    status: 'pending',
    requesterId: requesters[4]._id
  });
  tasks.push(task6);

  // Task 7: Pending task (Household chores)
  const task7 = await Task.create({
    title: 'Giúp việc nhà hàng tuần',
    description: 'Cần người giúp việc nhà 2 lần/tuần. Công việc: nấu ăn, giặt ủi, dọn dẹp. Thời gian linh hoạt.',
    category: categories.find(c => c.name === 'Giúp việc nhà')?.name || categories[6].name,
    images: ['/uploads/tasks/sample-task-13.jpg', '/uploads/tasks/sample-task-14.jpg'],
    location: {
      province: hueLocation?.province || locations[0].province,
      ward: hueLocation?.wards[2] || locations[0].wards[2]
    },
    price: 400000,
    postingFee: categories.find(c => c.name === 'Giúp việc nhà')?.postingFee || 10000,
    deadline: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // 6 days from now
    paymentProofUrl: null,
    status: 'pending',
    requesterId: requesters[1]._id
  });
  tasks.push(task7);

  // Task 8: Completed task (Other)
  const task8 = await Task.create({
    title: 'Dạy kèm tiếng Anh cho trẻ em',
    description: 'Cần giáo viên dạy kèm tiếng Anh cho con 8 tuổi. 2 buổi/tuần, mỗi buổi 1.5 giờ.',
    category: categories.find(c => c.name === 'Khác')?.name || categories[7].name,
    images: ['/uploads/tasks/sample-task-15.jpg', '/uploads/tasks/sample-task-16.jpg'],
    location: {
      province: halongLocation?.province || locations[0].province,
      ward: halongLocation?.wards[2] || locations[0].wards[2]
    },
    price: 600000,
    postingFee: categories.find(c => c.name === 'Khác')?.postingFee || 10000,
    deadline: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    paymentProofUrl: '/uploads/payments/sample-payment-5.jpg',
    status: 'completed',
    requesterId: requesters[2]._id
  });
  tasks.push(task8);

  // Task 9: Pending task - High price (Repair)
  const task9 = await Task.create({
    title: 'Sửa chữa hệ thống điện trong nhà',
    description: 'Hệ thống điện nhà có vấn đề, cần thợ điện chuyên nghiệp kiểm tra và sửa chữa. Có một số ổ cắm không hoạt động.',
    category: categories.find(c => c.name === 'Sửa chữa')?.name || categories[1].name,
    images: ['/uploads/tasks/sample-task-17.jpg', '/uploads/tasks/sample-task-18.jpg'],
    location: {
      province: mongcaiLocation?.province || locations[0].province,
      ward: mongcaiLocation?.wards[2] || locations[0].wards[2]
    },
    price: 800000,
    postingFee: categories.find(c => c.name === 'Sửa chữa')?.postingFee || 15000,
    deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
    paymentProofUrl: '/uploads/payments/sample-payment-6.jpg',
    status: 'pending',
    requesterId: requesters[3]._id
  });
  tasks.push(task9);

  // Task 10: Pending task - Low price (Delivery)
  const task10 = await Task.create({
    title: 'Giao bánh mì sáng',
    description: 'Cần giao 20 ổ bánh mì từ tiệm bánh đến văn phòng. Khoảng cách 2km. Giao trước 8h sáng.',
    category: categories.find(c => c.name === 'Giao hàng')?.name || categories[2].name,
    images: ['/uploads/tasks/sample-task-19.jpg', '/uploads/tasks/sample-task-20.jpg'],
    location: {
      province: hueLocation?.province || locations[0].province,
      ward: hueLocation?.wards[3] || locations[0].wards[3]
    },
    price: 50000,
    postingFee: categories.find(c => c.name === 'Giao hàng')?.postingFee || 5000,
    deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
    paymentProofUrl: null,
    status: 'pending',
    requesterId: requesters[4]._id
  });
  tasks.push(task10);

  console.log(`   ✅ Created ${tasks.length} test tasks`);
  return tasks;
};

/**
 * Create test messages between users
 */
const createTestMessages = async (users, tasks) => {
  console.log('💬 Creating test messages...');
  
  const taskers = users.filter(u => u.currentRole === 'tasker');
  const requesters = users.filter(u => u.currentRole === 'requester');
  const pendingTasks = tasks.filter(t => t.status === 'pending');

  if (taskers.length === 0 || requesters.length === 0 || pendingTasks.length === 0) {
    console.log('   ⚠️  Cannot create messages: missing taskers, requesters, or tasks');
    return [];
  }

  const messages = [];

  // Create conversations for some tasks
  // Task 1: Conversation between tasker1 and requester1
  if (pendingTasks[0] && taskers[0] && requesters[0]) {
    const task = pendingTasks[0];
    const tasker = taskers[0];
    const requester = requesters[0];

    messages.push(await Message.create({
      taskId: task._id,
      senderId: tasker._id,
      receiverId: requester._id,
      content: 'Xin chào! Tôi thấy bạn cần lắp ráp bàn ghế. Tôi có kinh nghiệm lắp ráp đồ nội thất IKEA. Bạn có thể cho tôi biết thêm chi tiết không?',
      isRead: true
    }));

    messages.push(await Message.create({
      taskId: task._id,
      senderId: requester._id,
      receiverId: tasker._id,
      content: 'Cảm ơn bạn đã quan tâm! Bộ bàn ghế này khá đơn giản, có hướng dẫn đầy đủ. Bạn có thể làm trong 2-3 giờ không?',
      isRead: true
    }));

    messages.push(await Message.create({
      taskId: task._id,
      senderId: tasker._id,
      receiverId: requester._id,
      content: 'Vâng, tôi có thể hoàn thành trong 2-3 giờ. Bạn muốn tôi đến vào lúc nào?',
      isRead: false
    }));
  }

  // Task 2: Conversation between tasker2 and requester2
  if (pendingTasks[1] && taskers[1] && requesters[1]) {
    const task = pendingTasks[1];
    const tasker = taskers[1];
    const requester = requesters[1];

    messages.push(await Message.create({
      taskId: task._id,
      senderId: tasker._id,
      receiverId: requester._id,
      content: 'Chào bạn! Tôi là thợ sửa máy lạnh có 5 năm kinh nghiệm. Tôi có thể đến kiểm tra máy lạnh của bạn vào cuối tuần này được không?',
      isRead: true
    }));

    messages.push(await Message.create({
      taskId: task._id,
      senderId: requester._id,
      receiverId: tasker._id,
      content: 'Tuyệt vời! Bạn có thể đến vào sáng thứ 7 không? Tôi ở nhà cả ngày.',
      isRead: true
    }));
  }

  // Task 4: Conversation between tasker3 and requester1
  if (pendingTasks[3] && taskers[2] && requesters[0]) {
    const task = pendingTasks[3];
    const tasker = taskers[2];
    const requester = requesters[0];

    messages.push(await Message.create({
      taskId: task._id,
      senderId: tasker._id,
      receiverId: requester._id,
      content: 'Xin chào! Tôi có thể giúp bạn vệ sinh nhà cửa. Tôi có kinh nghiệm làm việc tại các gia đình. Bạn muốn tôi đến vào lúc nào?',
      isRead: false
    }));
  }

  // Task 5: Multiple taskers interested
  if (pendingTasks[4] && taskers.length >= 2 && requesters[3]) {
    const task = pendingTasks[4];
    const requester = requesters[3];

    // Tasker 1
    messages.push(await Message.create({
      taskId: task._id,
      senderId: taskers[0]._id,
      receiverId: requester._id,
      content: 'Tôi có đội ngũ 3 người và xe tải. Có thể giúp bạn chuyển nhà vào cuối tuần này.',
      isRead: true
    }));

    // Tasker 2
    messages.push(await Message.create({
      taskId: task._id,
      senderId: taskers[1]._id,
      receiverId: requester._id,
      content: 'Xin chào! Tôi cũng có thể giúp bạn chuyển nhà. Giá của tôi có thể thương lượng.',
      isRead: false
    }));
  }

  console.log(`   ✅ Created ${messages.length} test messages`);
  return messages;
};

/**
 * Create test favorites
 */
const createTestFavorites = async (users, tasks) => {
  console.log('⭐ Creating test favorites...');
  
  const taskers = users.filter(u => u.currentRole === 'tasker');
  const pendingTasks = tasks.filter(t => t.status === 'pending');

  if (taskers.length === 0 || pendingTasks.length === 0) {
    console.log('   ⚠️  Cannot create favorites: missing taskers or tasks');
    return [];
  }

  const favorites = [];

  // Tasker 1 favorites multiple tasks
  if (taskers[0] && pendingTasks.length >= 3) {
    favorites.push(await Favorite.create({
      taskerId: taskers[0]._id,
      taskId: pendingTasks[0]._id
    }));

    favorites.push(await Favorite.create({
      taskerId: taskers[0]._id,
      taskId: pendingTasks[3]._id
    }));
  }

  // Tasker 2 favorites some tasks
  if (taskers[1] && pendingTasks.length >= 2) {
    favorites.push(await Favorite.create({
      taskerId: taskers[1]._id,
      taskId: pendingTasks[1]._id
    }));

    favorites.push(await Favorite.create({
      taskerId: taskers[1]._id,
      taskId: pendingTasks[4]._id
    }));
  }

  // Tasker 3 favorites a task
  if (taskers[2] && pendingTasks.length >= 5) {
    favorites.push(await Favorite.create({
      taskerId: taskers[2]._id,
      taskId: pendingTasks[5]._id
    }));
  }

  console.log(`   ✅ Created ${favorites.length} test favorites`);
  return favorites;
};

/**
 * Comprehensive seed function
 */
const comprehensiveSeed = async () => {
  try {
    console.log('🌱 Starting comprehensive database seeding...\n');

    // First, seed basic data (categories, locations, admin)
    const { seedDatabase } = require('./seedData');
    await seedDatabase(true); // Force reseed to ensure clean base

    // Create test users
    const users = await createTestUsers();

    // Create test tasks
    const tasks = await createTestTasks(users);

    // Create test messages
    const messages = await createTestMessages(users, tasks);

    // Create test favorites
    const favorites = await createTestFavorites(users, tasks);

    console.log('\n✨ Comprehensive seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Users: ${users.length} (1 admin, ${users.filter(u => u.currentRole === 'requester').length} requesters, ${users.filter(u => u.currentRole === 'tasker').length} taskers)`);
    console.log(`   - Tasks: ${tasks.length} (${tasks.filter(t => t.status === 'pending').length} pending, ${tasks.filter(t => t.status === 'completed').length} completed)`);
    console.log(`   - Messages: ${messages.length}`);
    console.log(`   - Favorites: ${favorites.length}`);
    console.log('\n🔑 Test Accounts:');
    console.log('   Admin: admin@taskie.com / password123');
    console.log('   Requesters: requester1@taskie.com to requester5@taskie.com / password123');
    console.log('   Taskers: tasker1@taskie.com to tasker5@taskie.com / password123');

    return {
      success: true,
      summary: {
        users: users.length,
        tasks: tasks.length,
        messages: messages.length,
        favorites: favorites.length
      }
    };
  } catch (error) {
    console.error('❌ Error in comprehensive seeding:', error);
    throw error;
  }
};

module.exports = {
  comprehensiveSeed,
  createTestUsers,
  createTestTasks,
  createTestMessages,
  createTestFavorites
};

