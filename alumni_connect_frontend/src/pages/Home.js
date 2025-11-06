import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../components/styles/Home.css";

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      // If logged in, go to dashboard based on role
      if (user.role === 'student') {
        navigate('/StudentDashboard');
      } else if (user.role === 'alumni') {
        navigate('/AlumniDashboard');
      }
    } else {
      // If not logged in, go to register
      navigate('/register');
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="home-container">
      {/* HEADER */}
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <svg
              className="logo-icon"
              fill="none"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.8261 17.4264C16.7203 18.1174 20.2244 18.5217 24 18.5217C27.7756 18.5217 31.2797 18.1174 34.1739 17.4264C36.9144 16.7722 39.9967 15.2331 41.3563 14.1648L24.8486 40.6391C24.4571 41.267 23.5429 41.267 23.1514 40.6391L6.64374 14.1648C8.00331 15.2331 11.0856 16.7722 13.8261 17.4264Z"
                fill="currentColor"
              ></path>
            </svg>
            <h2 className="logo-text">Alumni Connect</h2>
          </div>
          <nav className="nav">
            <a href="#">Mentorship</a>
            <a href="#">Jobs</a>
            <a href="#">Events</a>
          </nav>
          <div className="header-button">
            {isAuthenticated ? (
              <button onClick={handleGetStarted}>Dashboard</button>
            ) : (
              <>
                <button onClick={handleLogin} className="btn-login">
                  Login
                </button>
                <button onClick={handleGetStarted} className="btn-primary">Get Started</button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main>
        {/* HERO SECTION */}
        <section className="hero-section">
          <div
            className="hero-background"
            style={{
              backgroundImage:
                'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url("https://lh3.googleusercontent.com/aida-public/AB6AXuBAOGUygJob9egGwNsvObsTiKtOnpboWxfMCYhUhTlf8DoZ43ZhDSBZuzE-CRrFdoaVuDsZWtiBVEakQSCPrXnYr39xEbugXbTqf-1EB52xupqlwcJqFNf8Vjq7Kl9c81N9KlPE71QUbwywJI3KsoUHJObkglFL3FxiQMtLB6d0VBJlDLaRm1okHPPBMv1NWtargctPuskERdsGI_bPJ97JX1rfImzvra68CyX2wVRTvPd0dFmkj-BazJ0o-wLE4MFNPftwxpL8b1gS")',
            }}
          ></div>
          <div className="hero-content">
            <h1>Connect with Alumni, Shape Your Future</h1>
            <p>
              Alumni Connect is your gateway to a vibrant network of alumni,
              offering mentorship, job opportunities, and exclusive events.
              Powered by AI, we match you with the right connections to
              accelerate your career.
            </p>
            <button onClick={handleGetStarted}>
              {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
            </button>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="features-section">
          <div className="features-header">
            <h2>Unlock the Power of Alumni Connections</h2>
            <p>
              Alumni Connect provides a comprehensive platform to engage with
              alumni and advance your professional journey.
            </p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg
                  fill="currentColor"
                  height="28px"
                  viewBox="0 0 256 256"
                  width="28px"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Z"></path>
                </svg>
              </div>
              <h3>Mentorship</h3>
              <p>Gain invaluable guidance from experienced alumni mentors.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg
                  fill="currentColor"
                  height="28px"
                  viewBox="0 0 256 256"
                  width="28px"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M216,56H176V48a24,24,0,0,0-24-24H104A24,24,0,0,0,80,48v8H40A16,16,0,0,0,24,72V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V72A16,16,0,0,0,216,56Z"></path>
                </svg>
              </div>
              <h3>Jobs</h3>
              <p>Explore exclusive job openings within the alumni network.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg
                  fill="currentColor"
                  height="28px"
                  viewBox="0 0 256 256"
                  width="28px"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32Z"></path>
                </svg>
              </div>
              <h3>Events</h3>
              <p>Attend alumni events and expand your professional circle.</p>
            </div>
          </div>
        </section>

        {/* TRUSTED INSTITUTIONS SECTION */}
        <section className="trusted-section">
          <h2>Trusted by Leading Institutions</h2>
          <div className="trusted-grid">
            <div className="trusted-logo" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDN3zv6RzIQXtcXowviVCU2s9eGT3BzRalG9j6x_rcRatkOTxoLRpf2Ox2uR2kxtVlwSEWEYrXYjO_mN9jS4rV2LMBvNZwihOsycN8uHsgoFVxHiKGGSDUioEx8_61ros0tGjR_8ULg7BaD7q52LIaTO4z1U1AiJZv3yqoyBsKx7IaquOW_hgqG9Sv99z5-5fs7NU_son8sdcwy4ODvKo6--4x1Lww6Z7MVPqE97pZ_SAhsgGYC9NKR7N6zw5NW6ASEev8rTZfmgmAj")' }}></div>
            <div className="trusted-logo" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAOqD3nciLAAqk1jRgMlQzSvCpSjVTG6nDywy49ZQu0-arya5GZzXAdL_yX3cuogS5ZxmF1NKJYzKYz01RsrOfjfXyNQQt2yaRmezLEObbBTStIFACdEfHR60fNoemAz4EtPiE_ikaOJljUqnm3EQoR3xVoLc2QOc0tYdtYfbv80P21HilRfDgnJnYgOBPGaz4mOjzBS5qmRU75cvriRd688_wgACh69xKVZD6w4QaK0PIQEZaeowKGlMg6VlUwfkYkFm0vcklS4pIf")' }}></div>
            <div className="trusted-logo" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBwFI4kcMSMlDIT7GYlqlMzybISONMN8mZmuTbgtGdJa7FVNwCTNg7HyCOMlBX6qM1lo_Dra87i0AJb4DCgu7qruw-jke9KMj6ga-87tM0zEyAmodryK5mcpQnXxJjbdd1r2cBAmhZUwt4vLNPa-Bojz_MXnNz2z3wNBT4_NW3D1WK2JXjTioxWcQuLjPrRpt_2KpZMS6udU9Z9pxHPonhiv0Sg9Y-isImWzItqOJ-oHJUK4IgEIG4nOsB6ViEUQmRu-pyYzIBZgCh6")' }}></div>
            <div className="trusted-logo" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDO09dVp9uKTTBMreMNRkQjW6rJh0EXGZ0VsfappjUJTEpDSuT_4ONKkTeNLUFVgKxgVJR_Ee4UcNIS_Qv491WPgWh8a0m4M96q9li3lu5hMU046Ggvo88c84WwdrooiMFR7jBdDvTd7hyMTnydVsQjq7RDJIIC1-tBxh7jQ59a2GvOAZLu3UB6ANeU4hILKmPCCCX69CT74nOSVu3qMHCFnElvGnynDkWXExPi-1_2Y8nAtB41TAg4HbGK4TjyIm1k7lH60yo7rzcF")' }}></div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-links">
            <a href="#">About</a>
            <a href="#">Contact</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
          <p>© 2024 Alumni Connect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
