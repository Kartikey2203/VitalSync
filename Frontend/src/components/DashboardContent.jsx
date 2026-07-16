import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { uploadReport, getLatestReport } from "../services/reportService";

function DashboardContent() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [report, setReport] = useState(null);
  const [selectedDay, setSelectedDay] = useState("day1");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    if (token) {
      const fetchLatest = async () => {
        try {
          const data = await getLatestReport();
          if (data && data.report) {
            setReport(data.report);
          }
        } catch (err) {
          console.error("Error fetching latest report:", err);
        }
      };
      fetchLatest();
    }
  }, [token]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      await processUpload(file);
    }
  };
 const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (file) {
      await processUpload(file);
    }
  };

  const processUpload = async (file) => {
    setUploading(true);
    setUploadError(null);
    try {
      const data = await uploadReport(file);
      if (data.success && data.report) {
        setReport(data.report);
      } else {
        setUploadError(data.message || "Failed to process report.");
      }
    } catch (err) {
      console.error(err);
      setUploadError(
        err.response?.data?.message || err.message || "Error uploading file. Make sure backend is running."
      );
    } finally {
      setUploading(false);
    }
  };

  if (!report) {
    return (
      <div className="dashboard-hero" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div className="dashboard-upload-wrapper">
          <div className="upload-card">
            {!token ? (
              <>
                <div className="upload-icon-container">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                    <line x1="20" y1="8" x2="20" y2="14" />
                    <line x1="23" y1="11" x2="17" y2="11" />
                  </svg>
                </div>
                <h2>Track Your Health Records</h2>
                <p>To analyze your medical reports, track deficiencies, and receive personalized health plans, please log in or sign up first.</p>
                <button 
                  className="btn-select-file" 
                  style={{ width: "100%", padding: "14px", fontSize: "15px", marginTop: "10px" }}
                  onClick={() => navigate("/login")}
                >
                  Sign In / Sign Up
                </button>
              </>
            ) : uploading ? (
              <div className="upload-loading-container">
                <div className="upload-spinner"></div>
                <div className="upload-loading-text">Analyzing your lab report...</div>
                <div className="upload-loading-subtext">Gemini is extracting medical markers and calculating health scores</div>
              </div>
            ) : (
              <>
                <div className="upload-icon-container">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <h2>Analyze Your Lab Report</h2>
                <p>Upload your blood test or lab report (PDF/Image) to see your AI-powered health insights, deficiencies, meal plans, and more.</p>
                <div 
                  className={`upload-dropzone ${isDragOver ? "dragover" : ""}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById("report-file-input").click()}
                >
                  <span className="upload-dropzone-text">Drag & drop your file here, or click to browse</span>
                  <span className="upload-dropzone-subtext">Supports PDF, PNG, JPG up to 10MB</span>
                  <input 
                    type="file" 
                    id="report-file-input" 
                    style={{ display: "none" }} 
                    accept=".pdf,image/*"
                    onChange={handleFileSelect}
                  />
                  <button className="btn-select-file" onClick={(e) => {
                    e.stopPropagation();
                    document.getElementById("report-file-input").click();
                  }}>Choose File</button>
                </div>
                {uploadError && (
                  <div className="upload-error-message">
                    <strong>Upload failed:</strong> {uploadError}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  const healthScore = report?.aiResult?.healthScore;
  let healthStatus = "--";
  let statusColor = "rgba(255,255,255,0.5)";
  
  if (healthScore) {
    if (healthScore >= 80) {
      healthStatus = "Good";
      statusColor = "#4eb880";
    } else if (healthScore >= 50) {
      healthStatus = "Normal";
      statusColor = "#f9a03f";
    } else {
      healthStatus = "Bad";
      statusColor = "#ff5e5e";
    }
  }

  return (
    <div className="dashboard-hero">
      {/* Dashboard Actions Header */}
      <div className="dashboard-actions-header">
        <h2>Dashboard</h2>
        <button className="btn-upload-new" onClick={() => setReport(null)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          Upload New Report
        </button>
      </div>

      {/* 1. Overall Health Score */}
      <div className="hero-card box-health-score" style={{ justifyContent: "center" }}>
        <h3>Overall Health Score</h3>
        <div className="score-circle">
        <span>
          {healthScore || "--"}
        </span>
        </div>
        <h4 style={{ color: statusColor, fontSize: "24px", fontWeight: "700", margin: "0 0 24px 0", letterSpacing: "1px" }}>
          {healthStatus}
        </h4>
        {/* <button className="btn-outline-full">View Full Analysis</button> */}
      </div>

      {/* 2. Deficiency Summary */}
      <div className="hero-card box-deficiency-summary">
        <div className="card-header">
          <h3>Deficiency Summary</h3>
          {/* <span className="view-all">View All</span> */}
        </div>
        <div className="deficiency-grid">
          {report?.aiResult?.deficiencies ? (
            Object.entries(report.aiResult.deficiencies).slice(0, 4).map(([key, data]) => {
              const statusMap = {
                Low:        { width: "15%",  color: "#ff5e5e", glow: "rgba(255,94,94,0.5)" },
                Normal:     { width: "50%",  color: "#4eb880", glow: "rgba(78,184,128,0.5)" },
                Borderline: { width: "70%",  color: "#f9a03f", glow: "rgba(249,160,63,0.5)" },
                High:       { width: "88%",  color: "#f9a03f", glow: "rgba(249,160,63,0.5)" },
              };
              const style = statusMap[data.status] || { width: "0%", color: "#c6f135", glow: "rgba(198,241,53,0.5)" };
              return (
                <div className="def-card" key={key}>
                  <h4 style={{ textTransform: "capitalize" }}>{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
                  <p className="status" style={{ color: style.color }}>{data.status || "--"}</p>
                  {data.value !== undefined && data.value !== null && (
                    <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", marginBottom: "6px" }}>
                      Value: <strong style={{ color: "rgba(255,255,255,0.75)" }}>
                        {typeof data.value === "object" ? JSON.stringify(data.value) : data.value}
                      </strong>
                    </span>
                  )}
                  <div className="progress-bar">
                    <div
                      className="progress"
                      style={{
                        width: style.width,
                        background: style.color,
                        boxShadow: `0 0 10px ${style.glow}`,
                      }}
                    ></div>
                  </div>
                  {(data.min || data.max) && (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "6px" }}>
                      <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.3px" }}>
                        Min: <strong style={{ color: "rgba(255,255,255,0.55)" }}>{data.min}</strong>
                      </span>
                      <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.3px" }}>
                        Max: <strong style={{ color: "rgba(255,255,255,0.55)" }}>{data.max}</strong>
                      </span>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <>
              <div className="def-card">
                <h4>Vitamin D</h4>
                <p className="status">--</p>
                <div className="progress-bar"><div className="progress"></div></div>
              </div>
              <div className="def-card">
                <h4>Iron</h4>
                <p className="status">--</p>
                <div className="progress-bar"><div className="progress"></div></div>
              </div>
              <div className="def-card">
                <h4>Vitamin B12</h4>
                <p className="status">--</p>
                <div className="progress-bar"><div className="progress"></div></div>
              </div>
              <div className="def-card">
                <h4>Calcium</h4>
                <p className="status">--</p>
                <div className="progress-bar"><div className="progress"></div></div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 3. Nutrient Overview */}
      <div className="hero-card box-nutrient-overview">
        <h3>Nutrient Overview</h3>
        <div className="nutrient-list">
          {report?.aiResult?.nutrients ? (() => {
            const statusMap = {
              Low:        { width: "15%", color: "#ff5e5e" },
              Normal:     { width: "60%", color: "#4eb880" },
              Borderline: { width: "70%", color: "#f9a03f" },
              High:       { width: "88%", color: "#f9a03f" },
            };
            const entries = Object.entries(report.aiResult.nutrients).filter(([, val]) => {
              const raw = typeof val === "object" && val !== null ? val.value : val;
              return raw !== null && raw !== undefined && raw !== 0 && raw !== "0";
            }).slice(0, 5);
            if (entries.length === 0) {
              return <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>No nutrient data available in this report.</p>;
            }
            return entries.map(([key, val]) => {
              const isObj = typeof val === "object" && val !== null;
              const raw = isObj ? val.value : val;
              const status = isObj ? val.status : null;
              const style = statusMap[status] || { width: "40%", color: "#c6f135" };
              const displayVal = raw !== null && raw !== undefined ? raw : "--";
              return (
                <div className="nut-item" key={key} style={{ gap: "3px" }}>
                  <div className="nut-item-row" style={{ fontSize: "11px" }}>
                    <span style={{ textTransform: "capitalize", color: "rgba(255,255,255,0.8)" }}>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span style={{ color: style.color, fontWeight: "700", fontSize: "11px" }}>{status || displayVal}</span>
                  </div>
                  <div className="bar" style={{ height: "4px" }}>
                    <div className="fill" style={{ width: style.width, background: style.color, height: "100%", borderRadius: "4px", boxShadow: `0 0 5px ${style.color}70` }}></div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1px" }}>
                    <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.3)" }}>Val: <strong style={{ color: "rgba(255,255,255,0.55)" }}>{displayVal}</strong></span>
                    {isObj && val.min != null && val.max != null && (
                      <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.25)" }}>{val.min}–{val.max}</span>
                    )}
                  </div>
                </div>
              );
            });
          })() : (
            <>
              {["Iron", "Vitamin D", "Vitamin B12", "Calcium", "Folate", "Magnesium"].map((name) => (
                <div className="nut-item" key={name}>
                  <div className="nut-item-row"><span>{name}</span><span style={{ color: "rgba(255,255,255,0.3)" }}>--</span></div>
                  <div className="bar"><div className="fill" style={{ width: "0%" }}></div></div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>


      {/* 7. Report Summary */}
      <div className="hero-card box-report-summary">
        <h3>Report Summary</h3>
        <div className="rep-row"><span>Total Tests</span> <span>{report?.aiResult?.reportSummary?.totalTests || "--"}</span></div>
        <div className="rep-row"><span>Normal</span> <span className="text-green">{report?.aiResult?.reportSummary?.normal || "--"}</span></div>
        <div className="rep-row"><span>Low</span> <span className="text-red">{report?.aiResult?.reportSummary?.low || "--"}</span></div>
        <div className="rep-row"><span>High</span> <span className="text-red">{report?.aiResult?.reportSummary?.high || "--"}</span></div>
        <div className="rep-row"><span>Borderline</span> <span className="text-orange">{report?.aiResult?.reportSummary?.borderline || "--"}</span></div>
      </div>

      {/* 5. Meal Plan Preview */}
      <div className="hero-card box-meal-plan">
        <div className="card-header">
          <h3>Meal Plan Preview</h3>
          {/* <span className="view-all">View Full Plan</span> */}
        </div>
        <div className="meal-tabs" style={{ marginBottom: "12px" }}>
          {["day1", "day2", "day3", "day4", "day5", "day6", "day7"].map((day, idx) => (
            <button
              key={day}
              className={`tab ${selectedDay === day ? "active" : ""}`}
              onClick={() => setSelectedDay(day)}
            >
              Day {idx + 1}
            </button>
          ))}
        </div>
        <div className="meal-content" style={{ flex: 1, gap: "10px" }}>
          <div className="meal-col">
            <h4>Breakfast</h4>
            <ul><li style={{ fontSize: "13px", lineHeight: "1.55", padding: "12px 14px" }}>{report?.aiResult?.mealPlan?.[selectedDay]?.breakfast || "--"}</li></ul>
          </div>
          <div className="meal-col">
            <h4>Lunch</h4>
            <ul><li style={{ fontSize: "13px", lineHeight: "1.55", padding: "12px 14px" }}>{report?.aiResult?.mealPlan?.[selectedDay]?.lunch || "--"}</li></ul>
          </div>
          <div className="meal-col">
            <h4>Dinner</h4>
            <ul><li style={{ fontSize: "13px", lineHeight: "1.55", padding: "12px 14px" }}>{report?.aiResult?.mealPlan?.[selectedDay]?.dinner || "--"}</li></ul>
          </div>
        </div>
      </div>

      {/* 6. Top Recommendations */}
      <div className="hero-card box-top-rec">
        <h3>Top Recommendations</h3>
        <div className="rec-list">
          {report?.aiResult?.recommendations ? (
            report.aiResult.recommendations.map((rec, index) => (
              <div key={index} className="rec-item">
                {rec}
              </div>
            ))
          ) : (
            <div className="rec-item">No recommendations available.</div>
          )}
        </div>
      </div>

      {/* 4. AI Insights */}
      <div className="hero-card box-ai-insights">
        <h3>AI Insights</h3>
        <div className="insight-content">
          {report?.aiResult?.insights ? (
            <>
              <p style={{ margin: "0" }}><strong>Summary:</strong> {report.aiResult.insights.summary}</p>
              {report.aiResult.insights.healthRisks?.length > 0 && (
                <p style={{ margin: "0" }}><strong>Health Risks:</strong> {report.aiResult.insights.healthRisks.join(", ")}</p>
              )}
            </>
          ) : (
            <p>No report available to generate insights. Upload your lab reports to receive personalized health recommendations.</p>
          )}
          {/* <button className="btn-outline-small">View Detailed Insights</button> */}
        </div>
      </div>

    </div>
  );
}

export default DashboardContent;
