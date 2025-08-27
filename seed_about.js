const mongoose = require('mongoose');
const SiteContent = require('./models/SiteContent'); // import your model

// MongoDB URI
const MONGO_URI = "mongodb://localhost:27017/stmichael";

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB Connected');

    // Seed "about" section
    await SiteContent.findOneAndUpdate(
      { section: 'about' },
      { content: { title: 'Our Church', description: 'Welcome to our church! [Add more content...]' } },
      { upsert: true }
    );

    console.log('✅ Seed completed');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err);
    process.exit(1);
  });
