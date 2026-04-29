const Job = require("../models/Job");
const User = require("../models/User");
const Profile = require("../models/Profile");

//  ------- JOB RECOMMENDATION --------
exports.getRecommendedJobs = async (req, res) => {
  try {
    const userProfile = await Profile.findOne({ user: req.user._id });

    if (!userProfile || !userProfile.skills) {
      return res.json([]);
    }

    // 🔥 Clean WITHOUT splitting words
    const clean = (arr) =>
      arr.map(skill =>
        skill
          .toLowerCase()
          .replace(/\.js/g, "")   // react.js → react
          .replace(/[^a-z]/g, "") // remove special chars
      );

    const userSkills = clean(userProfile.skills);

    const jobs = await Job.find({ approved: true });

    const recommended = jobs.map((job) => {
      const jobSkills = clean(job.skillsRequired || []);

      const matchSkills = jobSkills.filter(skill =>
        userSkills.includes(skill)
      );

      const score =
        jobSkills.length > 0
          ? matchSkills.length / jobSkills.length
          : 0;

      return {
        ...job._doc,
        matchScore: score,
      };
    });

    recommended.sort((a, b) => b.matchScore - a.matchScore);

    res.json(recommended.slice(0, 5));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// exports.getRecommendedJobs = async (req, res) => {
//   try {
//     const userProfile = await Profile.findOne({ user: req.user._id });

//     if (!userProfile || !userProfile.skills) {
//       return res.json([]);
//     }

//     const cleanAndNormalize = (arr) =>
//       arr.flatMap(skill =>
//         skill
//           .toLowerCase()
//           .replace(/[^a-z ]/g, "")
//           .split(" ")
//       );

//     const userSkills = cleanAndNormalize(userProfile.skills);

//     const jobs = await Job.find({ approved: true });

//     const recommended = jobs.map((job) => {
//       const jobSkills = cleanAndNormalize(job.skillsRequired || []);

//       const matchSkills = jobSkills.filter((skill) =>
//         userSkills.includes(skill)
//       );

//       const score =
//         jobSkills.length > 0
//           ? matchSkills.length / jobSkills.length
//           : 0;

//       return {
//         ...job._doc,
//         matchScore: score,
//       };
//     });

//     recommended.sort((a, b) => b.matchScore - a.matchScore);

//     res.json(recommended.slice(0, 5));
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


// ---------- MENTOR RECOMMENDATION -------------
exports.getRecommendedMentors = async (req, res) => {
  try {
    const userProfile = await Profile.findOne({ user: req.user._id });

    if (!userProfile || !userProfile.skills) {
      return res.json([]);
    }

    // 🔥 Same clean + normalize function
    const cleanAndNormalize = (arr) =>
      arr.map((skill) =>
        skill.toLowerCase().replace(/[^a-z]/g, "")
      );

    const userSkills = cleanAndNormalize(userProfile.skills);

    const mentors = await User.find({ role: "alumni" });

    const recommendations = [];

    for (let mentor of mentors) {
      const mentorProfile = await Profile.findOne({ user: mentor._id });

      if (!mentorProfile || !mentorProfile.skills) continue;

      const mentorSkills = cleanAndNormalize(mentorProfile.skills);

      const matchedSkills = mentorSkills.filter((skill) =>
        userSkills.includes(skill)
      );

      const score = matchedSkills.length;

      recommendations.push({
        user: mentor,
        profile: mentorProfile,
        matchScore: score,
      });
    }

    recommendations.sort((a, b) => b.matchScore - a.matchScore);

    res.json(recommendations.slice(0, 5));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};