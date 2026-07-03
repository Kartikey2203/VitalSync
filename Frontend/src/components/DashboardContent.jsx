import React, { useEffect, useState } from "react";
import { getLatestReport } from "../services/reportService";

function DashboardContent() {
const [report, setReport] = useState(null);
const [loading, setLoading] = useState(true);
const [selectedDay, setSelectedDay] = useState("day1");

useEffect(() => {
  const fetchReport = async () => {
    try {
      const data = await getLatestReport();
      setReport(data.report);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  fetchReport();
}, []);
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
          <span className="view-all">View All</span>
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
                  {data.value && (
                    <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", marginBottom: "6px" }}>
                      Value: <strong style={{ color: "rgba(255,255,255,0.75)" }}>{data.value}</strong>
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
          {report?.aiResult?.nutrients ? (
            Object.entries(report.aiResult.nutrients).map(([key, val]) => (
              <div className="nut-item" key={key}>
                <div className="nut-item-row">
                  <span style={{ textTransform: "capitalize" }}>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span>{val}%</span>
                </div>
                <div className="bar">
                  <div
                    className="fill"
                    style={{ width: `${val}%`, height: "100%", borderRadius: "6px" }}
                  ></div>
                </div>
              </div>
            ))
          ) : (
            <>
              {["Iron", "Vitamin D", "Vitamin B12", "Calcium", "Folate", "Magnesium"].map((name) => (
                <div className="nut-item" key={name}>
                  <div className="nut-item-row"><span>{name}</span><span>--%</span></div>
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
        <button className="btn-outline-full">View Full Report</button>
      </div>

      {/* 5. Meal Plan Preview */}
      <div className="hero-card box-meal-plan">
         <div className="card-header">
          <h3>Meal Plan Preview</h3>
          <span className="view-all">View Full Plan</span>
        </div>
        <div className="meal-tabs">
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
        <div className="meal-content">
           <div className="meal-col">
             <h4>Breakfast</h4>
             <ul><li>{report?.aiResult?.mealPlan?.[selectedDay]?.breakfast || "--"}</li></ul>
           </div>
           <div className="meal-col">
             <h4>Lunch</h4>
             <ul><li>{report?.aiResult?.mealPlan?.[selectedDay]?.lunch || "--"}</li></ul>
           </div>
           <div className="meal-col">
             <h4>Dinner</h4>
             <ul><li>{report?.aiResult?.mealPlan?.[selectedDay]?.dinner || "--"}</li></ul>
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
          <button className="btn-outline-small">View Detailed Insights</button>
        </div>
      </div>

    </div>
  );
}

export default DashboardContent;
