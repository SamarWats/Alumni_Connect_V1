const express = require("express");
const router = express.Router();
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const { registerUser, loginUser } = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);

// Example protected routes:
router.get("/student-dashboard", protect, authorizeRoles("student"), (req, res) => {
  res.json({ message: "Welcome student!" });
});

router.get("/admin", protect, authorizeRoles("admin"), (req, res) => {
  res.json({ message: "Welcome admin!" });
});

router.get("/alumni-section", protect, authorizeRoles("alumni", "admin"), (req, res) => {
  res.json({ message: "Welcome alumni!" });
});

module.exports = router;
