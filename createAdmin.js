require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/admin');

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/stmichael', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const username = 'admin';
    const password = '123456';

    const admin = new Admin({ username, password });
    await admin.save(); // password will be hashed automatically by the pre-save hook

    console.log('✅ Admin user created');
    mongoose.connection.close();
  } catch (err) {
    console.error(err);
  }
}

createAdmin();
