import React from "react";
import "../styles/AlumniDashboard.css" // Import external CSS file

const AlumniDashboard = () => {
  return (
    <div className="alumni-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <img
            alt="Sarah Chen"
            className="sidebar-avatar"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuADCoRk1PKBriX_EQTN6Fkvm7VlMkfRLUaPoRsNhBerfJ4AczG9gDSaMg5mQA8lSydhj_kzcV5jE5xbqm3sd5O7Jw9o4S9MBszxr1SjLLNijS45jqRB-Tp51qFWzw4RfY6JRNSE8Mu1yIO-bjKVjmAHu9z81bA5WPh_zMVGvkHxKUk4snWJHSPNTWxlDRTV2t7DISPjreqR5BWL2uIaPUuCt08sc3do9fWKKhnyx4Q7dEIb_V8Fq2YbZzsS0HrXUakU8X5Ma0frYvvK"
          />
          <div>
            <h1 className="sidebar-name">Sarah Chen</h1>
            <p className="sidebar-role">Alumni</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {["Dashboard", "Mentorship", "Events", "Messages", "Profile"].map(
            (item, i) => (
              <a
                key={i}
                href="#"
                className={`sidebar-link ${i === 0 ? "active" : ""}`}
              >
                {item}
              </a>
            )
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <h1 className="dashboard-title">Dashboard</h1>

        <div className="dashboard-grid">
          {/* Left Column */}
          <div className="left-column">
            {/* Cards Section */}
            <div className="cards-grid">
              {[
                {
                  title: "Mentorship Request",
                  desc: "You have a new request from a student.",
                  btn: "View Request",
                  tag: "NEW",
                },
                {
                  title: "Post a Job",
                  desc: "Help students find opportunities.",
                  btn: "Post Job",
                },
                {
                  title: "Alumni Networking Mixer",
                  desc: "Join us for an evening of networking.",
                  btn: "View Event",
                },
                {
                  title: "New Message",
                  desc: "A student has sent you a message.",
                  btn: "View Message",
                },
              ].map((card, i) => (
                <div key={i} className="card">
                  {card.tag && <p className="card-tag">{card.tag}</p>}
                  <h3 className="card-title">{card.title}</h3>
                  <p className="card-desc">{card.desc}</p>
                  <button className="card-btn">{card.btn}</button>
                </div>
              ))}
            </div>

            {/* Suggested Mentees */}
            <div className="mentees-section">
              <h2 className="mentees-title">Suggested Mentees</h2>
              <div className="mentees-grid">
                {[
                  {
                    name: "Ethan Carter",
                    course: "Computer Science",
                    img: "https://randomuser.me/api/portraits/men/75.jpg",
                  },
                  {
                    name: "Olivia Harper",
                    course: "Business Administration",
                    img: "https://randomuser.me/api/portraits/women/65.jpg",
                  },
                  {
                    name: "Noah Bennett",
                    course: "Mechanical Engineering",
                    img: "https://randomuser.me/api/portraits/men/78.jpg",
                  },
                ].map((mentee, i) => (
                  <div key={i} className="mentee-card">
                    <img
                      src={mentee.img}
                      alt={mentee.name}
                      className="mentee-avatar"
                    />
                    <h4 className="mentee-name">{mentee.name}</h4>
                    <p className="mentee-course">{mentee.course}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="right-column">
            <div className="status-card">
              <h2 className="status-title">Verification Status</h2>
              <div className="status-content">
                <div className="status-icon">✅</div>
                <div>
                  <h4 className="status-label">Alumni Verification</h4>
                  <p className="status-value">Verified</p>
                </div>
              </div>
            </div>

            <div className="status-card">
              <h2 className="status-title">Contributions</h2>
              <div className="contribution-list">
                <div className="contribution-item">
                  <p>Mentorship Sessions</p>
                  <p className="contribution-value">5</p>
                </div>
                <div className="contribution-item">
                  <p>Job Postings</p>
                  <p className="contribution-value">2</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AlumniDashboard;
