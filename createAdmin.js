const mongoose = require('mongoose');
const Admin = require('./models/admin');

const MONGO_URI = 'mongodb://localhost:27017/stmichael';

async function createAdmin() {
  await mongoose.connect(MONGO_URI);

  // Remove old admin if exists
  await Admin.deleteMany({ username: 'admin' });

  // Create new admin with plain password (pre-save will hash it)
  const admin = new Admin({ username: 'admin', password: 'admin123' });
  await admin.save();

  console.log('✅ Admin user created!');
  mongoose.connection.close();
}

createAdmin().catch(console.error);
