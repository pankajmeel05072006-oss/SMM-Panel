require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

// ================= HEALTH CHECK =================

app.get("/", (req, res) => {
    res.send("SMM Panel Backend is running!");
});

// ================= SEND EMAIL =================

async function sendEmail(subject, html) {

    if (!RESEND_API_KEY) {
        throw new Error("RESEND_API_KEY is missing");
    }

    if (!ADMIN_EMAIL) {
        throw new Error("ADMIN_EMAIL is missing");
    }

    const response = await fetch("https://api.resend.com/emails", {
        method: "POST",

        headers: {
            "Authorization": `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            from: "SMM Panel <onboarding@resend.dev>",
            to: [ADMIN_EMAIL],
            subject: subject,
            html: html
        })
    });

    const data = await response.json();

    if (!response.ok) {
        console.error("Resend Error:", data);
        throw new Error(data.message || "Email sending failed");
    }

    console.log("Email sent successfully:", data);

    return data;
}

// ================= LOGIN NOTIFICATION =================

app.post("/notify-login", async (req, res) => {

    try {

        const { name, email } = req.body;

        await sendEmail(
            "New SocialBoost Login",
            `
            <h2>New User Login</h2>

            <p><b>Name:</b> ${name || "Not available"}</p>

            <p><b>Email:</b> ${email || "Not available"}</p>

            <p><b>Login Time:</b> ${new Date().toLocaleString("en-IN")}</p>
            `
        );

        res.json({
            success: true,
            message: "Login notification sent"
        });

    } catch (error) {

        console.error("Login notification error:", error);

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ================= PAYMENT NOTIFICATION =================

app.post("/notify-payment", async (req, res) => {

    try {

        const {
            name,
            email,
            amount,
            paymentId
        } = req.body;

        await sendEmail(
            "New Payment Received - SMM Panel",
            `
            <h2>New Payment Notification</h2>

            <p><b>Name:</b> ${name || "Not available"}</p>

            <p><b>User Email:</b> ${email || "Not available"}</p>

            <p><b>Amount:</b> ₹${amount || "Not available"}</p>

            <p><b>Payment ID:</b> ${paymentId || "Not available"}</p>

            <p><b>Payment Time:</b> ${new Date().toLocaleString("en-IN")}</p>

            <hr>

            <p>Please verify the payment in your payment gateway dashboard.</p>
            `
        );

        res.json({
            success: true,
            message: "Payment notification sent"
        });

    } catch (error) {

        console.error("Payment notification error:", error);

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ================= START SERVER =================

app.listen(PORT, "0.0.0.0", () => {

    console.log(`Backend running on port ${PORT}`);

});
