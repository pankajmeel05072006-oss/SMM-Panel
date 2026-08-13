require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

app.post("/notify-login", async (req, res) => {
  try {
    const { name, email } = req.body;

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: "New SocialBoost Login",
      text: `New user login

Name: ${name || "Not available"}
Email: ${email || "Not available"}
Login Time: ${new Date().toLocaleString("en-IN")}`
    });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Email failed" });
  }
});

// app.listen(5000, () => {
//   console.log("Backend running: http://localhost:5000");
// });

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend running on port ${PORT}`);
});