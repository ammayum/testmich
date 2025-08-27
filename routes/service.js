const express = require("express");
const router = express.Router();
const ServiceRequest = require("../models/ServiceRequest");
const nodemailer = require("nodemailer");
require("dotenv").config();

// Display service request page
router.get("/", (req, res) => {
  res.render("service", { title: "Request a Service", success: null });
});

// Handle form submission
router.post("/submit", async (req, res) => {
  const { name, email, service, message } = req.body;

  try {
    // Save to MongoDB
    const newRequest = new ServiceRequest({ name, email, service, message });
    await newRequest.save();

    // Send email notification
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO,
      subject: `New Service Request: ${service}`,
      text: `Name: ${name}\nEmail: ${email}\nService: ${service}\nMessage: ${message}`,
    };

    await transporter.sendMail(mailOptions);

    res.render("service", { title: "Request a Service", success: "Your request has been submitted successfully!" });
  } catch (err) {
    console.error(err);
    res.render("service", { title: "Request a Service", success: "Error submitting request. Please try again." });
  }
});

module.exports = router;
