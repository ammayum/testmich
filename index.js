const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const SiteContent = require('./models/SiteContent');
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 3000;






// ========================
// Middleware
// ========================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
const membershipRoutes = require("./routes/membership");
app.use("/membership", membershipRoutes);
app.use(
  session({
    secret: process.env.SESSION_SECRET || "mysecret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // true only if using HTTPS
  })
);

// ========================
// MongoDB Connection
// ========================
const MONGO_URI = "mongodb://localhost:27017/stmichael";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });






// Function to get live or latest video
async function getCurrentVideoId() {
  try {
   
// --- Replace with your details ---
const apiKey = "AIzaSyCyi3zDD2fUwsUbR4GGa_g8EIe5Vsqerug";   // from Google Cloud Console
const channelId = "UC1dV2HFYpPpM3qeGs5RluYg";     // your channel ID

    // 1️⃣ Check live videos first
    const liveUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&type=video&eventType=live&key=${apiKey}`;
    const liveResponse = await axios.get(liveUrl);

    if (liveResponse.data.items.length > 0) {
      return { videoId: liveResponse.data.items[0].id.videoId, isLive: true };
    }

    // 2️⃣ Fallback to latest uploaded video
    const recentUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&type=video&order=date&maxResults=1&key=${apiKey}`;
    const recentResponse = await axios.get(recentUrl);

    if (recentResponse.data.items.length > 0) {
      return { videoId: recentResponse.data.items[0].id.videoId, isLive: false };
    }

    return { videoId: null, isLive: false };
  } catch (err) {
    console.error("YouTube API error:", err.response?.data || err.message);
    return { videoId: null, isLive: false };
  }
}














// ========================
// Routes
// ========================
const { router: adminRoutes, isAdmin } = require("./routes/admin");
const cmsRoutes = require("./routes/cms");
const serviceRoutes = require("./routes/service");

app.use("/admin", adminRoutes);          // Admin login/logout
app.use("/cms", isAdmin, cmsRoutes);     // CMS dashboard (protected)
app.use("/service", serviceRoutes);      // Service routes
// --- New youtube ROUTE ---
app.get("/youtube-live", async (req, res) => {
  const video = await getCurrentVideoId();  // Use the new function
  res.render("youtube-live", { videoId: video.videoId, isLive: video.isLive });
});

// API endpoint for AJAX polling
app.get("/youtube-live-check", async (req, res) => {
  const video = await getCurrentVideoId();
  res.json(video);
});


// ========================
// Pages
// ========================
app.get("/", async (req, res) => {
  const hero = await SiteContent.findOne({ section: 'hero' });
  const services = await SiteContent.findOne({ section: 'services' });
  const donation = await SiteContent.findOne({ section: 'donation' });
  const live = await SiteContent.findOne({ section: 'live' });

  res.render("index", {
    hero: hero ? hero.content : {},
    services: services ? services.content : { items: [] },
    donation: donation ? donation.content : {},
    live: live ? live.content : {}
  });
});



app.get("/our-church", async (req, res) => {
  const section = await SiteContent.findOne({ section: 'about' });
  res.render("our-church", { 
    title: "Our Church",
    aboutContent: section ? section.content : { title: 'Our Church', description: 'Welcome to our church!' }
  });
});


app.get("/donation", (req, res) => {
  res.render("donation", { title: "Donation", clientId: process.env.PAYPAL_CLIENT_ID });
});

// Donation record POST
app.post("/donation/record", (req, res) => {
  const { name, email, amount, transactionId } = req.body;
  console.log(`Donation received: ${name}, ${email}, £${amount}, TxnID: ${transactionId}`);
  // TODO: Save donation info to MongoDB
  res.sendStatus(200);
});

// ========================
// Start Server
// ========================
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
