import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { chatDiagnose } from "../services/reportService";
import "./home.css";
import "./dashboard.css";
import "./diagnose.css";

function Diagnose() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      role: "model",
      text: "Hello! I am your VitalSync AI Health Assistant. Ask me anything about symptoms, diet, nutrition, fitness, or general health concerns. Please note: I only answer health-related questions.",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleSend = async (textToSend) => {
    const trimmed = textToSend.trim();
    if (!trimmed || loading) return;

    // Add user message
    const updatedMessages = [...messages, { role: "user", text: trimmed }];
    setMessages(updatedMessages);
    setInputText("");
    setLoading(true);

    try {
      // Exclude first welcome message from the history sent to Gemini API
      const history = updatedMessages
        .slice(1, -1) // slice out the welcome bot message and the user's latest message
        .map((m) => ({
          role: m.role,
          text: m.text,
        }));

      const data = await chatDiagnose(trimmed, history);

      if (data && data.success) {
        setMessages((prev) => [...prev, { role: "model", text: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "model", text: "Sorry, I encountered an issue processing your query. Please try again." },
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "model", text: "Error communicating with the health bot. Please check your network or try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSend(inputText);
  };

  const suggestions = [
    "What are the best Indian foods to improve low hemoglobin level?",
    "Suggest a simple home remedy for mild seasonal throat cough",
    "What are the early indicators of Vitamin D deficiency?",
    "Suggest a simple 15-minute home workout for lower back strength",
  ];

  return (
    <div className="vitalsync-landing">
      {/* NAV */}
      <nav className={`nav ${isScrolled ? "scrolled" : ""}`}>
        <div className="nav-logo" onClick={() => navigate("/")}>
          <svg viewBox="0 0 32 32" className="nav-logo-svg" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="8" />
            <path d="M7 16h3l2-5 3 10 2-8 2 5h6" />
            <circle cx="25" cy="9" r="2" />
            <circle cx="7" cy="9" r="2" />
          </svg>
          <span>Vital<span className="logo-accent">Sync</span></span>
        </div>
        <ul className="nav-links">
          <li><a href="/" onClick={(e) => { e.preventDefault(); navigate("/"); }}>Home</a></li>
          <li><a href="/dashboard" onClick={(e) => { e.preventDefault(); navigate("/dashboard"); }}>Overview</a></li>
          <li><a href="/records" onClick={(e) => { e.preventDefault(); navigate("/records"); }}>Records</a></li>
          <li><a href="/diagnose" onClick={(e) => { e.preventDefault(); navigate("/diagnose"); }}>Diagnose</a></li>
        </ul>
        <div className="nav-right">
          {user ? (
            <>
              <span style={{ fontSize: "13px", color: "rgba(255, 255, 255, 0.7)", fontWeight: "500" }}>
                Hello, {user.name}
              </span>
              <button className="btn-outline" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button className="btn-outline" onClick={() => navigate("/login")}>
                Login
              </button>
              <button className="btn-cta" onClick={() => navigate("/login")}>Get Started</button>
            </>
          )}
        </div>
      </nav>

      {/* Chat Container */}
      <div className="diagnose-container" style={{ marginTop: "70px" }}>
        {/* Sidebar */}
        <div className="diagnose-sidebar">
          <h2>Diagnose</h2>
          <p>
            Welcome to the VitalSync AI Health Assistant. Ask our virtual health specialist about symptoms, nutrition, fitness, or general health concerns.
          </p>

          <div className="sidebar-section-title">Common Queries</div>
          <div className="suggestion-chips-container">
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                className="suggestion-chip"
                onClick={() => handleSend(s)}
                disabled={loading}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Chat window area */}
        <div className="diagnose-chat-area">
          <div className="diagnose-chat-header">
            <div className="chat-header-info">
              <div className="chat-bot-avatar">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12a10 10 0 0 1 10-10z" />
                  <path d="M12 6v12M6 12h12" />
                </svg>
              </div>
              <div>
                <span className="chat-bot-name">AI Health Assistant</span>
                <span className="chat-status-pulse"></span>
              </div>
            </div>
          </div>

          {/* Messages list */}
          <div className="diagnose-messages-list">
            {messages.map((m, idx) => (
              <div key={idx} className={`chat-message-row ${m.role === "user" ? "user" : "bot"}`}>
                <div className="chat-bubble">{m.text}</div>
              </div>
            ))}
            {loading && (
              <div className="chat-message-row bot">
                <div className="chat-bubble">
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input form */}
          <div className="diagnose-chat-footer">
            <form onSubmit={handleSubmit} className="diagnose-chat-input-bar">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask a health, fitness, or wellness question..."
                disabled={loading}
              />
              <button
                type="submit"
                className="btn-send-message"
                disabled={!inputText.trim() || loading}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </form>
            <div className="chat-disclaimer">
              Disclaimer: The VitalSync AI Health Assistant provides general guidance and educational information only. It is NOT a substitute for professional medical advice, diagnosis, or treatment. Always consult a physician for health concerns.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Diagnose;
