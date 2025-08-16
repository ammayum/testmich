const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "mysecret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // true only if using HTTPS
  })
);

// MongoDB URI
const MONGO_URI = "mongodb://localhost:27017/stmichael";

// Connect MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");

    // Routes
    const adminRoutes = require("./routes/admin");
    const cmsRoutes = require("./routes/cms");
    const { isAdmin } = require("./routes/admin");

    app.use("/admin", adminRoutes);
    app.use("/cms", isAdmin, cmsRoutes);

    // Home page
    app.get("/", (req, res) => {
      res.render("index", { title: "Home Page" });
    });

    // Our Church page
    app.get("/our-church", (req, res) => {
      res.render("our-church", { title: "Our Church" });
    });

    // Donation page (GET)
    app.get("/donation", (req, res) => {
      res.render("donation", { title: "Donation", clientId: process.env.PAYPAL_CLIENT_ID });
    });

    // Donation record endpoint (POST from PayPal)
    app.post("/donation/record", (req, res) => {
      const { name, email, amount, transactionId } = req.body;
      console.log(`Donation received: ${name}, ${email}, £${amount}, TxnID: ${transactionId}`);
      // TODO: Save donation info to MongoDB
      res.sendStatus(200);
    });

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });
