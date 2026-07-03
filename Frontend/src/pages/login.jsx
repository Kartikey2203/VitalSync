import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./login.css";

function Login() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse) => {
    setError(null);
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/google",
        {
          token: credentialResponse.credential
        }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Google login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (isSignUp && !name) {
      setError("Name is required for registration.");
      setLoading(false);
      return;
    }
    if (!email || !password) {
      setError("Email and password are required.");
      setLoading(false);
      return;
    }

    try {
      const endpoint = isSignUp 
        ? "http://localhost:5000/api/auth/register" 
        : "http://localhost:5000/api/auth/login";
      
      const payload = isSignUp ? { name, email, password } : { email, password };
      
      const res = await axios.post(endpoint, payload);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Authentication failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo" onClick={() => navigate("/")}>
            <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="8" className="login-logo-rect" />
              <path d="M7 16h3l2-5 3 10 2-8 2 5h6" className="login-logo-path" />
              <circle cx="25" cy="9" r="2" className="login-logo-circle" />
              <circle cx="7" cy="9" r="2" className="login-logo-circle" />
            </svg>
            <span>Vital<span style={{ color: "#2e9e6b" }}>Sync</span></span>
          </div>
          <h2>{isSignUp ? "Create an Account" : "Welcome Back"}</h2>
          <p>{isSignUp ? "Sign up to track and analyze your health records" : "Sign in to access your health dashboard"}</p>
        </div>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          {isSignUp && (
            <div className="form-group">
              <label htmlFor="name-input">Full Name</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="name-input"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email-input">Email Address</label>
            <div className="input-wrapper">
              <input
                type="email"
                id="email-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password-input">Password</label>
            <div className="input-wrapper">
              <input
                type="password"
                id="password-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <button type="submit" className="btn-login-submit" disabled={loading}>
            {loading ? "Please wait..." : isSignUp ? "Create Account" : "Sign In"}
          </button>
        </form>

        <div className="login-divider">or sign in with</div>

        <div className="google-login-container">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError("Google Login Failed")}
            theme="filled_dark"
            size="large"
            shape="pill"
            width="100%"
          />
        </div>

        <div className="login-footer">
          {isSignUp ? (
            <>
              Already have an account?{" "}
              <a href="#" onClick={(e) => { e.preventDefault(); setIsSignUp(false); setError(null); }}>
                Sign In
              </a>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <a href="#" onClick={(e) => { e.preventDefault(); setIsSignUp(true); setError(null); }}>
                Sign Up
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;