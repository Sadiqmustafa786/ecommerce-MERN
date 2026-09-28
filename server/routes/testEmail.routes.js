import express from "express";
import { sendEmail } from "../services/email.service.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    await sendEmail({
      to: "YOUR_EMAIL@gmail.com",
      subject: "Test Email - My Store",
      html: `
        <h2>Email Test Successful 🎉</h2>

        <p>This is a test email from my MERN application.</p>

        <p>Nodemailer is working correctly.</p>
      `,
    });

    res.status(200).json({
      message: "Test email sent successfully",
    });
  } catch (error) {
    console.error("Test Email Error:", error);

    res.status(500).json({
      message: "Failed to send test email",
      error: error.message,
    });
  }
});

export default router;
