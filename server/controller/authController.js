import User from "../models/User.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";
import generateToken from "../utils/generateToken.js";
import { createNotification } from "../services/notification.service.js";
import { sendEmail } from "../services/email.service.js";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Signup

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    void createNotification({
      type: "user_signup",
      title: "New user registered",
      message: `${user.name} created an account`,
      user: user._id,
    });

    res.status(201).json({
      message: "Signup successful",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },

      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Login

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    if (user.role !== "admin") {
      void createNotification({
        type: "user_login",
        title: "User logged in",
        message: `${user.name} logged in`,
        user: user._id,
      });
    }

    res.json({
      message: "Login successful",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },

      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const forgotPassword = async (req, res) => {
  const genericResponse = {
    message: "If an account exists for this email, a reset link has been sent",
  };

  try {
    const email = req.body.email?.trim().toLowerCase();

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json(genericResponse);
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");
    user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${rawToken}`;

    try {
      await sendEmail({
        to: user.email,
        subject: "Reset your password",
        html: `
          <div style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.6;">
            <h2>Password reset request</h2>
            <p>Use the button below to choose a new password. This link expires in 15 minutes.</p>
            <p><a href="${resetUrl}" style="display: inline-block; padding: 10px 16px; color: #ffffff; background: #2563eb; text-decoration: none; border-radius: 6px;">Reset Password</a></p>
            <p>If you did not request this, you can ignore this email.</p>
          </div>
        `,
      });
    } catch (emailError) {
      user.passwordResetToken = null;
      user.passwordResetExpires = null;
      await user.save();
      throw emailError;
    }

    return res.status(200).json(genericResponse);
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({ message: "Unable to process password reset" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password || password.length < 8) {
      return res.status(400).json({
        message: "A valid token and password of at least 8 characters are required",
      });
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      passwordResetToken: tokenHash,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ message: "Reset link is invalid or expired" });
    }

    user.password = await bcrypt.hash(password, 10);
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ message: "Unable to reset password" });
  }
};

export const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        message: "Google credential is required",
      });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      return res.status(400).json({
        message: "Invalid Google account",
      });
    }

    const email = payload.email.toLowerCase();
    const name = payload.name || payload.given_name || "Google User";

    let isNewUser = false;
    let user = await User.findOne({ email });

    if (!user) {
      const randomPassword = await bcrypt.hash(
        `google-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        10,
      );

      user = await User.create({
        name,
        email,
        password: randomPassword,
        provider: "google",
      });

      isNewUser = true;
    } else if (user.provider !== "google") {
      user.provider = "google";
      await user.save();
    }

    if (user.role !== "admin") {
      void createNotification({
        type: isNewUser ? "user_signup" : "user_login",
        title: isNewUser ? "New user registered" : "User logged in",
        message: `${user.name} ${isNewUser ? "created an account" : "logged in"}`,
        user: user._id,
      });
    }

    return res.status(200).json({
      message: isNewUser
        ? "Google signup successful"
        : "Google login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Google Auth Error:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,

      message: "Logout successful",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};
