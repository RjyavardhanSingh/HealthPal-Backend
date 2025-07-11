const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { protect } = require("../middlewares/auth");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const Person = require("../models/Person");
const admin = require("../config/firebase-admin");
const jwt = require("jsonwebtoken");

// Public routes (no authentication required)
router.post("/register", authController.register);
router.post("/register-google", authController.registerGoogle);
// Make sure this route is BEFORE the protect middleware
router.post("/admin-login", async (req, res) => {
  try {
    // Log request body for debugging
    console.log("Admin login request body:", {
      email: req.body.email,
      passwordProvided: !!req.body.password,
    });

    // Call the controller
    return authController.adminLogin(req, res);
  } catch (error) {
    console.error("Admin login route error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error during admin authentication",
    });
  }
});

// Add this login route BEFORE the protect middleware

// Handle login request
router.post("/login", authController.login);

// Fix Google authentication route
router.post("/google", async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "No token provided",
      });
    }

    // Verify Google token
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { email, name, picture, uid } = decodedToken;

    // IMPORTANT: Check Doctor model FIRST
    let user = await Doctor.findOne({ email });
    let userRole = "doctor";

    // Only if not found as doctor, check patient
    if (!user) {
      user = await Patient.findOne({ email });
      userRole = "patient";

      if (!user) {
        user = await Person.findOne({ email });
        userRole = user?.role || "patient";

        // If still no user, create a new patient
        if (!user) {
          user = await Patient.create({
            name: name || email.split("@")[0],
            email,
            firebaseUid: uid,
            profileImage: picture || "",
            role: "patient",
          });
          userRole = "patient";
        }
      }
    }

    // Update Firebase UID if needed
    if (!user.firebaseUid || user.firebaseUid !== uid) {
      user.firebaseUid = uid;
      await user.save();
    }

    // Generate JWT with correct role - FIX: rename token to jwtToken
    const jwtToken = jwt.sign(
      { id: user._id, role: userRole },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    return res.status(200).json({
      success: true,
      token: jwtToken,
      user: {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        role: userRole,
        profileImage: user.profileImage || null,
        specialization: user.specialization,
      },
    });
  } catch (error) {
    console.error("Google auth error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Authentication failed",
    });
  }
});

// Add this route to handle authentication requests
router.post("/authenticate", async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "No token provided",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // If token is valid, fetch fresh user data
    let user;
    const userId = decoded.id;
    const userRole = decoded.role;

    if (userRole === "doctor") {
      user = await Doctor.findById(userId).select("-password");
    } else if (userRole === "patient") {
      user = await Patient.findById(userId).select("-password");
    } else {
      user = await Person.findById(userId).select("-password");
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update token with fresh data
    const newToken = jwt.sign(
      { id: user._id, role: userRole },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    // Return fresh data
    return res.status(200).json({
      success: true,
      token: newToken,
      user: {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        role: userRole,
        profileImage: user.profileImage || null,
        ...(userRole === "doctor" && {
          verificationStatus: user.verificationStatus,
        }),
      },
    });
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
});

// Add this to your routes
router.post("/verify", async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "No token provided",
      });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user still exists
    let user;

    if (decoded.role === "doctor") {
      user = await Doctor.findById(decoded.id).select("-password");
    } else if (decoded.role === "patient") {
      user = await Patient.findById(decoded.id).select("-password");
    } else {
      user = await Person.findById(decoded.id).select("-password");
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists",
      });
    }

    // If doctor check verification status
    if (decoded.role === "doctor" && user.verificationStatus !== "approved") {
      return res.status(403).json({
        success: false,
        message: "Account pending verification",
        pendingVerification: true,
      });
    }

    // Token and user are valid
    return res.status(200).json({
      success: true,
      message: "Token is valid",
    });
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
});

// Add or verify this line BEFORE the protect middleware
router.post("/admin-login", authController.adminLogin);

// Protected routes should be after this
router.use(protect);
router.get("/me", authController.getMe);
router.get("/verify", authController.verifyToken);
router.put("/profile", authController.updateProfile);
router.put("/password", authController.updatePassword);
router.put("/notification-settings", authController.updateNotificationSettings);

module.exports = router;
