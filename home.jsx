import "./home.css";
import { Link } from "react-router-dom";
function Home() {
  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className="landing-navbar">
        <div className="landing-logo">
          <svg viewBox="0 0 32 32" className="landing-logo-svg" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
            <rect width="32" height="32" rx="8" fill="#2e9e6b" />
            <path d="M7 16h3l2-5 3 10 2-8 2 5h6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="25" cy="9" r="2" fill="#c6f135" />
            <circle cx="7" cy="9" r="2" fill="#c6f135" />
          </svg>
          <div className="landing-logo-text">
            <span className="vital">Vital</span><span className="sync">Sync</span>
          </div>
        </div>

        <ul className="landing-nav-links">
         <Link to="/"><li>Home</li></Link>
          <Link to="/overview"><li>Overview</li></Link>
          <Link to="/records"><li>Records</li></Link>
        </ul>

        <div className="landing-nav-actions">
          <a href="tel:+123456789" className="call-us-link">
          </a>
          <button className="lets-talk-btn">
              Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        {/* <div className="hero-badge">
          AI-Powered Health Monitoring
        </div> */}

        <h1>
          Upload Reports.
          <br />
          Understand Your Health.
        </h1>

        <p>
          Analyze lab reports, detect deficiencies, track health records,
          and receive personalized health recommendations using AI.
        </p>

        <div className="hero-buttons">
          <button className="primary-btn">
            Start Diagnosis
          </button>

          <button className="secondary-btn">
            View Records
          </button>
        </div>
      </section>


    </div>
  );
}

export default Home;
