import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/user.js';

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);

export const googleLogin = async (req, res) => {
  console.log("Google Route Hit");
  console.log(req.body);
  try {

    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();

    const {
      sub,
      email,
      name,
      picture
    } = payload;

    let user = await User.findOne({ email });

    if (!user) {

      user = await User.create({
        googleId: sub,
        email,
        name,
        picture
      });

    } else if (!user.googleId) {
      // If user registered with email and now logs in with Google, link account or update
      user.googleId = sub;
      if (!user.picture && picture) user.picture = picture;
      await user.save();
    }

    // Update login history
    const loginEntry = {
      ip: req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      userAgent: req.headers['user-agent']
    };
    user.lastLogin = new Date();
    user.loginHistory.push(loginEntry);
    await user.save();

    const jwtToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token: jwtToken,
      user
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists with this email" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    // Update login history
    const loginEntry = {
      ip: req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      userAgent: req.headers['user-agent']
    };
    user.lastLogin = new Date();
    user.loginHistory.push(loginEntry);
    await user.save();

    const jwtToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      token: jwtToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    if (!user.password) {
      return res.status(400).json({
        error: "This account uses Google Login. Please sign in with Google."
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Update login history
    const loginEntry = {
      ip: req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      userAgent: req.headers['user-agent']
    };
    user.lastLogin = new Date();
    user.loginHistory.push(loginEntry);
    await user.save();

    const jwtToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token: jwtToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};