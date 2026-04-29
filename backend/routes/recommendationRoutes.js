const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
  getRecommendedJobs,
  getRecommendedMentors,
} = require("../controllers/recommendationController");

router.get("/jobs", protect, getRecommendedJobs);
router.get("/mentors", protect, getRecommendedMentors);

module.exports = router;