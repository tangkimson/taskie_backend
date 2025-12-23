# Database Reset and Seed Guide

This guide explains how to reset and seed your databases (both local and production) with comprehensive test data.

## ⚠️ Important Warnings

- **Resetting a database will PERMANENTLY DELETE ALL DATA**
- Always backup your production database before resetting
- Double-check your `MONGODB_URI` environment variable before running reset scripts

## 📋 Available Scripts

### 1. Reset Database (Delete All Data)

Completely deletes all collections from the database.

**Local Database:**
```bash
cd taskie-backend
npm run reset
```

**Production Database (MongoDB Atlas):**
```bash
cd taskie-backend
MONGODB_URI="your-production-mongodb-uri" npm run reset
```

**Skip Confirmation (Use with extreme caution):**
```bash
FORCE=true npm run reset
```

### 2. Seed Database (Add Test Data)

Populates the database with test data.

**Comprehensive Seed (Recommended):**
Includes users, tasks, messages, favorites, categories, and locations.
```bash
npm run seed
```

**Basic Seed (Categories, Locations, Admin Only):**
```bash
BASIC=true npm run seed
```

**Force Reseed (Clears existing data first):**
```bash
FORCE=true npm run seed
```

### 3. Reset and Seed in One Command

Resets the database and immediately seeds it with comprehensive test data.

**Local:**
```bash
npm run reset-and-seed
```

**Production:**
```bash
MONGODB_URI="your-production-mongodb-uri" FORCE=true npm run reset-and-seed
```

## 🔄 Complete Reset Process

### For Local Database:

1. **Reset the database:**
   ```bash
   cd taskie-backend
   npm run reset
   ```
   - Type "yes" when prompted to confirm

2. **Seed with comprehensive test data:**
   ```bash
   npm run seed
   ```

### For Production Database (MongoDB Atlas):

1. **Get your MongoDB Atlas connection string:**
   - Go to MongoDB Atlas dashboard
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password

2. **Reset the production database:**
   ```bash
   cd taskie-backend
   MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/database" npm run reset
   ```
   - Type "yes" when prompted to confirm

3. **Seed with comprehensive test data:**
   ```bash
   MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/database" npm run seed
   ```

   Or do both in one command:
   ```bash
   MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/database" FORCE=true npm run reset-and-seed
   ```

## 📊 What Gets Created

### Comprehensive Seed Includes:

1. **Users (11 total):**
   - 1 Admin user
   - 5 Requester users
   - 5 Tasker users
   - All passwords: `password123`

2. **Tasks (10 total):**
   - 7 Pending tasks (various categories, locations, prices)
   - 3 Completed tasks
   - Mix of tasks with and without payment proofs
   - Different price ranges (50,000 VND to 1,500,000 VND)
   - Various deadlines

3. **Messages:**
   - Multiple conversations between taskers and requesters
   - Mix of read and unread messages
   - Messages about different tasks

4. **Favorites:**
   - Taskers have favorited various tasks
   - Multiple favorites per tasker

5. **Categories (8 total):**
   - Lắp ráp đồ dùng
   - Sửa chữa
   - Giao hàng
   - Vệ sinh
   - Chuyển nhà
   - Làm vườn
   - Giúp việc nhà
   - Khác

6. **Locations:**
   - Thành phố Huế (26 phường)
   - Thành phố Hạ Long
   - Thành phố Móng Cái
   - Thành phố Cẩm Phả
   - Thành phố Uông Bí
   - Thị xã Quảng Yên
   - Huyện Vân Đồn
   - Huyện Cô Tô
   - Huyện Đông Triều
   - Thành phố Hồ Chí Minh
   - Thành phố Đà Nẵng

## 🔑 Test Accounts

After seeding, you can log in with these accounts:

**Admin:**
- Email: `admin@taskie.com`
- Password: `password123`

**Requesters:**
- `requester1@taskie.com` / `password123`
- `requester2@taskie.com` / `password123`
- `requester3@taskie.com` / `password123`
- `requester4@taskie.com` / `password123`
- `requester5@taskie.com` / `password123`

**Taskers:**
- `tasker1@taskie.com` / `password123`
- `tasker2@taskie.com` / `password123`
- `tasker3@taskie.com` / `password123`
- `tasker4@taskie.com` / `password123`
- `tasker5@taskie.com` / `password123`

## 🧪 Testing Scenarios Covered

The comprehensive seed data covers:

✅ User registration and login (all roles)
✅ Task creation (all categories)
✅ Task search and filtering
✅ Task status management (pending/completed)
✅ Payment proof upload
✅ Messaging between users
✅ Favorites functionality
✅ Profile management
✅ Admin dashboard features
✅ Location-based filtering
✅ Price range filtering
✅ Category filtering
✅ Multiple conversations per task
✅ Read/unread message status
✅ Task completion workflow

## 🛠️ Troubleshooting

**Error: "Cannot find module"**
- Make sure you're in the `taskie-backend` directory
- Run `npm install` if you haven't already

**Error: "MongoDB connection failed"**
- Check your `MONGODB_URI` in `.env` file
- For production, ensure your IP is whitelisted in MongoDB Atlas
- Verify your MongoDB credentials are correct

**Error: "Collection not found"**
- This is normal if the database is empty
- The seed script will create collections automatically

**Reset script asks for confirmation:**
- This is a safety feature
- Type "yes" to proceed
- Use `FORCE=true` to skip confirmation (use with caution)

## 📝 Notes

- The reset script will show you all collections that will be deleted before asking for confirmation
- The comprehensive seed is idempotent - running it multiple times will update existing records
- Basic seed mode only creates categories, locations, and admin user
- All test data uses realistic Vietnamese names and scenarios
- Image paths in tasks are placeholders - actual images need to be uploaded through the application


