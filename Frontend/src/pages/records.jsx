import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllReports, deleteReport } from "../services/reportService";
import "./home.css";
import "./dashboard.css";
import "./records.css";

function Records() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [selectedDay, setSelectedDay] = useState("day1");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchReports = async () => {
      try {
        setLoading(true);
        const data = await getAllReports();
        if (data && data.success) {
          setReports(data.reports || []);
          if (data.reports && data.reports.length > 0) {
            setSelectedReport(data.reports[0]);
          }
        }
      } catch (err) {
        console.error("Error fetching reports:", err);
        setError("Could not load previous records. Make sure backend server is running.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this health record?")) {
      return;
    }

    try {
      const data = await deleteReport(id);
      if (data && data.success) {
        const updatedReports = reports.filter((r) => r._id !== id);
        setReports(updatedReports);
        if (selectedReport?._id === id) {
          setSelectedReport(updatedReports.length > 0 ? updatedReports[0] : null);
        }
      }
    } catch (err) {
      console.error("Error deleting report:", err);
      alert("Failed to delete the report. Please try again.");
    }
  };

  const getScoreBadgeClass = (score) => {
    if (!score) return "";
    if (score >= 80) return "good";
    if (score >= 50) return "normal";
    return "bad";
  };

  const getScoreStatusText = (score) => {
    if (!score) return "--";
    if (score >= 80) return "Good";
    if (score >= 50) return "Normal";
    return "Bad";
  };

  const getScoreColor = (score) => {
    if (!score) return "rgba(255,255,255,0.5)";
    if (score >= 80) return "#4eb880";
    if (score >= 50) return "#f9a03f";
    return "#ff5e5e";
  };

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

      {/* Main Records Container */}
      <div className="records-container" style={{ marginTop: "70px" }}>
        {/* Sidebar */}
        <div className="records-sidebar">
          <div className="sidebar-header">
            <h2>History</h2>
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>
              {reports.length} {reports.length === 1 ? "Record" : "Records"}
            </span>
          </div>

          <div className="records-list">
            {loading ? (
              <div className="records-loading-container">
                <div className="records-spinner"></div>
                <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>Loading...</span>
              </div>
            ) : error ? (
              <div style={{ color: "#ff5e5e", fontSize: "13px", padding: "10px", textAlign: "center" }}>
                {error}
              </div>
            ) : reports.length === 0 ? (
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", textAlign: "center", padding: "20px" }}>
                No records found. Upload a report in dashboard first!
              </div>
            ) : (
              reports.map((rep) => (
                <div
                  key={rep._id}
                  className={`record-item ${selectedReport?._id === rep._id ? "active" : ""}`}
                  onClick={() => setSelectedReport(rep)}
                >
                  <div className="record-item-meta">
                    <span className="record-filename" title={rep.originalFileName}>
                      {rep.originalFileName}
                    </span>
                    <span className={`record-score-badge ${getScoreBadgeClass(rep.aiResult?.healthScore)}`}>
                      {rep.aiResult?.healthScore || "--"}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span className="record-date">
                      {new Date(rep.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <button
                      onClick={(e) => handleDelete(rep._id, e)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "rgba(255, 94, 94, 0.6)",
                        cursor: "pointer",
                        fontSize: "11px",
                        padding: "2px",
                      }}
                      title="Delete record"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Details / Main View */}
        <div className="records-details">
          {loading ? (
            <div className="records-loading-container">
              <div className="records-spinner"></div>
              <h2>Retrieving reports...</h2>
            </div>
          ) : selectedReport ? (
            <div className="records-details-scrollable">
              {/* Header */}
              <div className="records-detail-header">
                <div className="records-detail-header-left">
                  <h1>{selectedReport.originalFileName}</h1>
                  <p>
                    Analyzed on{" "}
                    {new Date(selectedReport.createdAt).toLocaleDateString(undefined, {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <button
                  className="btn-delete-report"
                  onClick={(e) => handleDelete(selectedReport._id, e)}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                  Delete Report
                </button>
              </div>

              {/* Grid content */}
              <div className="records-detail-grid">
                {/* 1. Score */}
                <div className="records-card col-score">
                  <h3>Health Score</h3>
                  <div className={`detail-score-circle ${getScoreBadgeClass(selectedReport.aiResult?.healthScore)}`}>
                    <span>{selectedReport.aiResult?.healthScore || "--"}</span>
                  </div>
                  <h4
                    className="detail-health-status"
                    style={{ color: getScoreColor(selectedReport.aiResult?.healthScore) }}
                  >
                    {getScoreStatusText(selectedReport.aiResult?.healthScore)}
                  </h4>
                </div>

                {/* 2. Deficiencies */}
                <div className="records-card col-deficiencies">
                  <h3>Deficiency Summary</h3>
                  <div className="deficiency-grid">
                    {selectedReport.aiResult?.deficiencies ? (
                      Object.entries(selectedReport.aiResult.deficiencies).slice(0, 4).map(([key, data]) => {
                        const statusMap = {
                          Low: { width: "15%", color: "#ff5e5e", glow: "rgba(255,94,94,0.5)" },
                          Normal: { width: "50%", color: "#4eb880", glow: "rgba(78,184,128,0.5)" },
                          Borderline: { width: "70%", color: "#f9a03f", glow: "rgba(249,160,63,0.5)" },
                          High: { width: "88%", color: "#f9a03f", glow: "rgba(249,160,63,0.5)" },
                        };
                        const style = statusMap[data.status] || {
                          width: "0%",
                          color: "#c6f135",
                          glow: "rgba(198,241,53,0.5)",
                        };
                        return (
                          <div className="deficiency-card" key={key}>
                            <h4 style={{ textTransform: "capitalize" }}>
                              {key.replace(/([A-Z])/g, " $1").trim()}
                            </h4>
                            <p className="status" style={{ color: style.color }}>
                              {data.status || "--"}
                            </p>
                            {data.value !== undefined && data.value !== null && (
                              <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", marginBottom: "6px" }}>
                                Value: <strong style={{ color: "rgba(255,255,255,0.75)" }}>
                                  {typeof data.value === "object" ? JSON.stringify(data.value) : data.value}
                                </strong>
                              </span>
                            )}
                            <div className="deficiency-progress">
                              <div
                                className="deficiency-progress-fill"
                                style={{
                                  width: style.width,
                                  background: style.color,
                                  boxShadow: `0 0 10px ${style.glow}`,
                                }}
                              ></div>
                            </div>
                            {(data.min || data.max) && (
                              <div className="meta-range">
                                <span>Min: {data.min}</span>
                                <span>Max: {data.max}</span>
                              </div>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <p style={{ color: "rgba(255,255,255,0.4)" }}>No deficiency information found.</p>
                    )}
                  </div>
                </div>

                {/* 3. Nutrients */}
                <div className="records-card col-nutrients">
                  <h3>Nutrients Overview</h3>
                  <div className="nutrient-list" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    {selectedReport.aiResult?.nutrients ? (
                      Object.entries(selectedReport.aiResult.nutrients).map(([key, val]) => {
                        const raw = typeof val === "object" && val !== null ? val.value : val;
                        const numVal = raw != null && !isNaN(Number(raw)) ? Number(raw) : null;
                        return (
                          <div className="nut-item" key={key} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                            <div
                              className="nut-item-row"
                              style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}
                            >
                              <span style={{ textTransform: "capitalize" }}>
                                {key.replace(/([A-Z])/g, " $1").trim()}
                              </span>
                              <span>{numVal != null ? `${numVal}%` : "--"}</span>
                            </div>
                            <div
                              className="bar"
                              style={{ height: "6px", background: "rgba(255,255,255,0.08)", borderRadius: "6px" }}
                            >
                              <div
                                className="fill"
                                style={{
                                  width: numVal != null ? `${numVal}%` : "0%",
                                  height: "100%",
                                  background: "#c6f135",
                                  borderRadius: "6px",
                                  boxShadow: "0 0 8px rgba(198, 241, 53, 0.4)",
                                }}
                              ></div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p style={{ color: "rgba(255,255,255,0.4)" }}>No nutrient information found.</p>
                    )}
                  </div>
                </div>

                {/* 4. AI Insights */}
                <div className="records-card col-insights">
                  <h3>AI Insights</h3>
                  <div className="insight-content" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {selectedReport.aiResult?.insights ? (
                      <>
                        <p style={{ margin: "0", fontSize: "14px", lineHeight: "1.6" }}>
                          <strong>Summary:</strong> {selectedReport.aiResult.insights.summary}
                        </p>
                        {selectedReport.aiResult.insights.healthRisks?.length > 0 && (
                          <div style={{ fontSize: "14px" }}>
                            <strong>Potential Health Risks:</strong>
                            <ul style={{ margin: "6px 0 0 0", paddingLeft: "20px", color: "rgba(255,255,255,0.8)" }}>
                              {selectedReport.aiResult.insights.healthRisks.map((risk, index) => (
                                <li key={index} style={{ marginBottom: "4px" }}>
                                  {risk}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </>
                    ) : (
                      <p style={{ color: "rgba(255,255,255,0.4)" }}>No detailed insights available for this report.</p>
                    )}
                  </div>
                </div>

                {/* 5. Meal Plan */}
                <div className="records-card col-mealplan">
                  <div className="card-header" style={{ marginBottom: "16px" }}>
                    <h3>Meal Plan Preview</h3>
                  </div>
                  <div className="meal-tabs" style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "10px" }}>
                    {["day1", "day2", "day3", "day4", "day5", "day6", "day7"].map((day, idx) => (
                      <button
                        key={day}
                        className={`tab ${selectedDay === day ? "active" : ""}`}
                        onClick={() => setSelectedDay(day)}
                        style={{
                          background: selectedDay === day ? "rgba(198, 241, 53, 0.15)" : "rgba(255,255,255,0.03)",
                          color: selectedDay === day ? "#c6f135" : "rgba(255,255,255,0.6)",
                          border: `1px solid ${selectedDay === day ? "rgba(198, 241, 53, 0.3)" : "rgba(255,255,255,0.08)"}`,
                          borderRadius: "8px",
                          padding: "6px 12px",
                          fontSize: "12px",
                          fontWeight: "600",
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Day {idx + 1}
                      </button>
                    ))}
                  </div>
                  <div
                    className="meal-content"
                    style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "16px" }}
                  >
                    <div className="meal-col">
                      <h4 style={{ margin: "0 0 6px 0", fontSize: "14px", color: "rgba(255,255,255,0.5)" }}>Breakfast</h4>
                      <p style={{ margin: "0", fontSize: "14px" }}>
                        {selectedReport.aiResult?.mealPlan?.[selectedDay]?.breakfast || "--"}
                      </p>
                    </div>
                    <div className="meal-col">
                      <h4 style={{ margin: "0 0 6px 0", fontSize: "14px", color: "rgba(255,255,255,0.5)" }}>Lunch</h4>
                      <p style={{ margin: "0", fontSize: "14px" }}>
                        {selectedReport.aiResult?.mealPlan?.[selectedDay]?.lunch || "--"}
                      </p>
                    </div>
                    <div className="meal-col">
                      <h4 style={{ margin: "0 0 6px 0", fontSize: "14px", color: "rgba(255,255,255,0.5)" }}>Dinner</h4>
                      <p style={{ margin: "0", fontSize: "14px" }}>
                        {selectedReport.aiResult?.mealPlan?.[selectedDay]?.dinner || "--"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 6. Recommendations */}
                <div className="records-card col-recommendations">
                  <h3>Top Recommendations</h3>
                  <div
                    className="rec-list"
                    style={{ display: "flex", flexDirection: "column", gap: "10px" }}
                  >
                    {selectedReport.aiResult?.recommendations ? (
                      selectedReport.aiResult.recommendations.map((rec, index) => (
                        <div
                          key={index}
                          className="rec-item"
                          style={{
                            background: "rgba(255,255,255,0.02)",
                            border: "1px solid rgba(255,255,255,0.04)",
                            borderRadius: "12px",
                            padding: "12px 16px",
                            fontSize: "14px",
                            lineHeight: "1.5",
                          }}
                        >
                          {rec}
                        </div>
                      ))
                    ) : (
                      <div className="rec-item">No recommendations available.</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="records-empty-state">
              <div className="empty-state-card">
                <svg
                  className="empty-icon"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                <h3>No Records Available</h3>
                <p>
                  You haven't uploaded or analyzed any medical reports yet. Upload one now on the dashboard to view your AI analysis.
                </p>
                <button
                  className="btn-primary-action"
                  onClick={() => navigate("/dashboard")}
                >
                  Upload New Report
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Records;
