// utils/notifications.js
require('dotenv').config();
const nodemailer = require('nodemailer');
const twilio = require('twilio');

// --------------------
// Email Setup (NodeMailer)
// --------------------
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT) || 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendEmail(to, subject, text, html = null) {
  try {
    await transporter.sendMail({
      from: `"St Michael Church" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html: html || text
    });
    console.log(`✅ Email sent to ${to}`);
  } catch (err) {
    console.error("❌ Email error:", err);
  }
}

// --------------------
// WhatsApp Setup (Twilio)
// --------------------
/* const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

async function sendWhatsApp(to, message) {
  try {
    await client.messages.create({
      from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
      to: `whatsapp:${to}`,
      body: message
    });
    console.log(`✅ WhatsApp sent to ${to}`);
  } catch (err) {
    console.error("❌ WhatsApp error:", err);
  }
}
 */
module.exports = { sendEmail /*, sendWhatsApp */ };
