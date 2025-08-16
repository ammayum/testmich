const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware — must come before routes
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

// Session middleware — must come BEFORE route definitions
app.use(session({
  secret: process.env.SESSION_SECRET || 'mysecret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // true only if using HTTPS
}));

// MongoDB URI
const MONGO_URI = "mongodb://localhost:27017/stmichael";

// Connect MongoDB first, then start server
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");

    // Load routes AFTER DB is connected
    const adminRoutes = require("./routes/admin");
    const cmsRoutes = require("./routes/cms");
    const { isAdmin } = require('./routes/admin');

    // Admin routes
    app.use("/admin", adminRoutes); // admin login & management

    // CMS routes protected by isAdmin middleware
    app.use("/cms", isAdmin, cmsRoutes);

    // Home page route
    app.get("/", (req, res) => {
      res.render("index", { title: "Home Page" });
    });

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1); // Stop the app if DB is not connected
  });
