const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Register
const register = async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    // Input Validation (basic example)
    if (!userName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Check if user already exists
    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered. Please use a different email.",
      });
    }

    // Hash password
    const hashPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = new User({
      userName,
      email,
      password: hashPassword,
    });
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      {
        id: newUser._id,
        role: newUser.role,
        email: newUser.email,
        userName: newUser.userName,
      },
      process.env.CLIENT_SECRET_KEY,
      { expiresIn: "15m" } // Short-lived token
    );

    // Set HttpOnly cookie for token
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Enable in production
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send response
    res.status(201).json({
      success: true,
      message: "Registered successfully",
      user: {
        email: newUser.email,
        role: newUser.role,
        id: newUser._id,
        userName: newUser.userName,
      },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred. Please try again later.",
    });
  }
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;
  // console.log(email, password )

  try {
    const checkUser = await User.findOne({ email });
    // console.log(checkUser)
    if (!checkUser)
      return res.status(404).json({
        success: false,
        message: "User doesn't exist! Please register first",
      });

    const checkPasswordMatch = await bcrypt.compare(password, checkUser.password);
    // console.log(checkPasswordMatch)
    if (!checkPasswordMatch)
      return res.status(401).json({
        success: false,
        message: "Incorrect password! Please try again",
      });

    const token = jwt.sign(
      {
        id: checkUser._id,
        role: checkUser.role,
        email: checkUser.email,
        userName: checkUser.userName,
      },
      process.env.CLIENT_SECRET_KEY,
      { expiresIn: "600000000m" }
    );

    res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" }).json({
      success: true,
      message: "Logged in successfully",
      user: {
        email: checkUser.email,
        role: checkUser.role,
        id: checkUser._id,
        userName: checkUser.userName,
      },
    });
  } catch (e) {
    // console.error(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred, please try again later.",
    });
  }
};

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  if(!token) return res.status(401).json({
    success: false,
    message : "Unauthrosid user!"
  })

  try {
    const decoded = jwt.verify(token,process.env.CLIENT_SECRET_KEY)
    req.user = decoded
    next()
  } catch (error) {
   res.status(401).json({
    success : false ,
   }) 
  }
}

const logoutUser = (req, res) => {
  // console.log("Clearing token cookie");
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/", // Make sure this matches the original cookie path
  });
  res.json({
    success: true,
    message: "Logged out successfully!",
  });
};


module.exports = { register, login , logoutUser , authMiddleware };
