import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css';
import './dashboard.css';
import DashboardContent from '../components/DashboardContent';

function Home() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.reload();
  };

  const scrollToDashboard = () => {
    const dashboardElement = document.getElementById('dashboard-section');
    if (dashboardElement) {
      dashboardElement.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="vitalsync-landing">

      {/* NAV */}
      <nav className={`nav ${isScrolled ? 'scrolled' : ''}`}>
      {/* <nav className={`nav`}> */}
        <div className="nav-logo" onClick={() => navigate('/')}>
          <svg viewBox="0 0 32 32" className="nav-logo-svg" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="8" />
            <path d="M7 16h3l2-5 3 10 2-8 2 5h6" />
            <circle cx="25" cy="9" r="2" />
            <circle cx="7" cy="9" r="2" />
          </svg>
          <span>Vital<span className="logo-accent">Sync</span></span>
        </div>
        <ul className="nav-links">
          <li><a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Home</a></li>
          <li><a href="/dashboard" onClick={(e) => { e.preventDefault(); navigate('/dashboard'); }}>Overview</a></li>
          <li><a href="/records" onClick={(e) => { e.preventDefault(); navigate('/records'); }}>Records</a></li>
        </ul>
        <div className="nav-right">
          {user ? (
            <>
              <span style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.7)', fontWeight: '500' }}>
                Hello, {user.name}
              </span>
              <button className="btn-outline" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button className="btn-outline" onClick={() => navigate('/login')}>
                Login
              </button>
              <button className="btn-cta" onClick={() => navigate('/login')}>Get Started</button>
            </>
          )}
        </div>
      </nav>
      
      {/* HERO */}
      <section className="hero">
        <h1>Upload Reports,<br/>Understand Your Health.<br/></h1>
        <p>VitalSync Analyze lab reports, detect deficiencies, track health records,<br/> and receive personalized health recommendations using AI.</p>
        <div className="hero-btns">
          <button className="btn-primary" onClick={() => navigate(user ? '/dashboard' : '/login')}>
            Get Started
            <div className="arrow">
              <svg width="12" height="12" viewBox="0 0 24 24" className="btn-arrow-svg">
                <path d="M7 17L17 7M7 7h10v10"/>
              </svg>
            </div>
          </button>
          <button className="btn-outline" onClick={scrollToDashboard}>
            View Dashboard
            <svg width="14" height="14" viewBox="0 0 24 24" className="btn-view-svg">
              <path d="M7 17L17 7M7 7h10v10"/>
            </svg>
          </button>
        </div>
      </section>

      {/* DASHBOARD SECTION INJECTED FOR SEAMLESS SCROLL */}
      <section id="dashboard-section" className="dashboard-section">
        <DashboardContent />
      </section>

      {/* BRAND BAR */}
      <div className="brand-bar">
        <span className="brand-mono">∞∞∞</span>
        <span>⬤ HEALTH</span>
        <span className="brand-sm">logoipsum</span>
        <span className="brand-md">LOCO</span>
        <span className="brand-lg">◑</span>
      </div>

    </div>
  );
}

export default Home;
