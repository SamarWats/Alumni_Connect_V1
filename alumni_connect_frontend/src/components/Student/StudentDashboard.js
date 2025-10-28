import React, { useState } from "react";
import "../styles/StudentDashboard.css";
import { FaHome, FaBookOpen, FaUserGraduate, FaChartLine, FaBell } from "react-icons/fa";

const StudentDashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  const recommendations = [
    {
      id: 1,
      title: "Web Development Fundamentals",
      description: "Learn HTML, CSS, and JavaScript from scratch.",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    },
    {
      id: 2,
      title: "Python for Data Science",
      description: "Master data analysis and machine learning using Python.",
      image: "https://images.unsplash.com/photo-1555949963-aa79dcee981d",
    },
    {
      id: 3,
      title: "AI & Machine Learning Basics",
      description: "Start your journey in Artificial Intelligence.",
      image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
    },
  ];

  const activities = [
    {
      id: 1,
      title: "Completed JavaScript Course",
      description: "You have successfully completed all 12 modules.",
      progress: 100,
    },
    {
      id: 2,
      title: "Ongoing: Python Project",
      description: "Working on final submission for ML assignment.",
      progress: 70,
    },
  ];

  return (
    <div className="dashboard-container">
      {/* === SIDEBAR === */}
      <aside className="sidebar">
        <div>
          <div className="user-profile">
            <img
              src="https://i.pravatar.cc/150?img=32"
              alt="User Avatar"
            />
            <div className="user-info">
              <h1>Hi, Samar</h1>
              <p>Student</p>
            </div>
          </div>

          <nav>
            <a
              href="#"
              className={`nav-link ${activeSection === "dashboard" ? "active" : ""}`}
              onClick={() => setActiveSection("dashboard")}
            >
              <FaHome className="icon" />
              Dashboard
            </a>
            <a
              href="#"
              className={`nav-link ${activeSection === "courses" ? "active" : ""}`}
              onClick={() => setActiveSection("courses")}
            >
              <FaBookOpen className="icon" />
              My Courses
            </a>
            <a
              href="#"
              className={`nav-link ${activeSection === "progress" ? "active" : ""}`}
              onClick={() => setActiveSection("progress")}
            >
              <FaChartLine className="icon" />
              Progress
            </a>
            <a
              href="#"
              className={`nav-link ${activeSection === "profile" ? "active" : ""}`}
              onClick={() => setActiveSection("profile")}
            >
              <FaUserGraduate className="icon" />
              Profile
            </a>
          </nav>
        </div>

        <button className="nav-link logout">
          Logout
        </button>
      </aside>

      {/* === MAIN CONTENT === */}
      <main className="main-content">
        <header className="dashboard-header">
          <h1>Welcome Back, Samar 👋</h1>
          <p>Here’s your learning summary and new recommendations.</p>
        </header>

        <section className="card section-overview">
          <h2>Recent Activity</h2>
          <div className="activity-section">
            {activities.map((activity) => (
              <div key={activity.id} className="activity-card">
                <div className="activity-icon">
                  <FaBell />
                </div>
                <div>
                  <h3>{activity.title}</h3>
                  <p>{activity.description}</p>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${activity.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="card section-recommendations" style={{ marginTop: "2rem" }}>
          <h2>Recommended for You</h2>
          <div className="recommendations-grid">
            {recommendations.map((rec) => (
              <div key={rec.id} className="card recommendation-card">
                <img src={rec.image} alt={rec.title} />
                <div className="card-body">
                  <h3>{rec.title}</h3>
                  <p>{rec.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default StudentDashboard;
