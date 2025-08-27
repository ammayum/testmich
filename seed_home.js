// seed.js
const mongoose = require('mongoose');
const SiteContent = require('./models/SiteContent');

const MONGO_URI = "mongodb://localhost:27017/stmichael";

mongoose.connect(MONGO_URI).then(async () => {
  console.log("✅ MongoDB Connected");

  await SiteContent.findOneAndUpdate(
    { section: 'hero' },
    {
      section: 'hero',
      content: {
        title: "St. Michael Ethiopian Orthodox Tewahedo Church",
        subtitle: "Welcome to our parish community",
        buttonText: "Learn More",
        buttonLink: "/our-church",
        backgroundImage: "/images/church-bg.jpg"
      }
    },
    { upsert: true }
  );

  await SiteContent.findOneAndUpdate(
    { section: 'services' },
    {
      section: 'services',
      content: {
        title: "Our Services",
        items: [
          { image: "/images/baptism.jpg", title: "Baptism", description: "Holy sacrament of rebirth in Christ." },
          { image: "/images/communion.jpg", title: "Holy Communion", description: "Receiving the true Body and Blood of Christ." },
          { image: "/images/matrimony.jpg", title: "Matrimony", description: "Holy union and blessing of Christian marriage." },
          { image: "/images/wake.jpg", title: "Wake Service", description: "Prayer and remembrance for the departed faithful." }
        ]
      }
    },
    { upsert: true }
  );

  await SiteContent.findOneAndUpdate(
    { section: 'donation' },
    {
      section: 'donation',
      content: {
        title: "Support The Church",
        description: "Help us grow and serve the community. Your generosity sustains our parish life.",
        buttonText: "Donate Now",
        buttonLink: "/donation"
      }
    },
    { upsert: true }
  );

  await SiteContent.findOneAndUpdate(
    { section: 'live' },
    {
      section: 'live',
      content: {
        title: "Live Stream",
        youtubeId: "YOUR_LIVE_STREAM_ID"
      }
    },
    { upsert: true }
  );

  console.log("✅ Homepage content seeded");
  process.exit();
});
