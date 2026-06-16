import React from 'react';

function DashboardContent() {
  return (
    <div className="dashboard-hero">

      {/* 1. Overall Health Score */}
      <div className="hero-card box-health-score">
        <h3>Overall Health Score</h3>
        <div className="score-circle">
          <span>--</span>
        </div>
        <p>No Report Uploaded</p>
        <button className="btn-outline-full">View Full Analysis</button>
      </div>

      {/* 2. Deficiency Summary */}
      <div className="hero-card box-deficiency-summary">
        <div className="card-header">
          <h3>Deficiency Summary</h3>
          <span className="view-all">View All</span>
        </div>
        <div className="deficiency-grid">
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
        </div>
      </div>

      {/* 3. Nutrient Overview */}
      <div className="hero-card box-nutrient-overview">
        <h3>Nutrient Overview</h3>
        <div className="nutrient-list">
           <div className="nut-item"><span>Iron</span> <div className="bar"><div className="fill"></div></div> <span>--</span></div>
           <div className="nut-item"><span>Vitamin D</span> <div className="bar"><div className="fill"></div></div> <span>--</span></div>
           <div className="nut-item"><span>Vitamin B12</span> <div className="bar"><div className="fill"></div></div> <span>--</span></div>
           <div className="nut-item"><span>Calcium</span> <div className="bar"><div className="fill"></div></div> <span>--</span></div>
           <div className="nut-item"><span>Folate</span> <div className="bar"><div className="fill"></div></div> <span>--</span></div>
           <div className="nut-item"><span>Magnesium</span> <div className="bar"><div className="fill"></div></div> <span>--</span></div>
        </div>
      </div>

      {/* 4. AI Insights */}
      <div className="hero-card box-ai-insights">
        <h3>AI Insights</h3>
        <div className="insight-content">
          <p>No report available to generate insights. Upload your lab reports to receive personalized health recommendations.</p>
          <button className="btn-outline-small">View Detailed Insights</button>
        </div>
      </div>

      {/* 5. Meal Plan Preview */}
      <div className="hero-card box-meal-plan">
         <div className="card-header">
          <h3>Meal Plan Preview</h3>
          <span className="view-all">View Full Plan</span>
        </div>
        <div className="meal-tabs">
          <button className="tab active">Day 1</button>
          <button className="tab">Day 2</button>
          <button className="tab">Day 3</button>
          <button className="tab">Day 4</button>
          <button className="tab">Day 5</button>
          <button className="tab">Day 6</button>
          <button className="tab">Day 7</button>
        </div>
        <div className="meal-content">
           <div className="meal-col">
             <h4>Breakfast</h4>
             <ul><li>--</li></ul>
           </div>
           <div className="meal-col">
             <h4>Lunch</h4>
             <ul><li>--</li></ul>
           </div>
           <div className="meal-col">
             <h4>Dinner</h4>
             <ul><li>--</li></ul>
           </div>
        </div>
      </div>

      {/* 6. Top Recommendations */}
      <div className="hero-card box-top-rec">
        <h3>Top Recommendations</h3>
        <div className="rec-list">
           <div className="rec-item">--</div>
           <div className="rec-item">--</div>
           <div className="rec-item">--</div>
           <div className="rec-item">--</div>
        </div>
      </div>

      {/* 7. Report Summary */}
      <div className="hero-card box-report-summary">
        <h3>Report Summary</h3>
        <div className="rep-row"><span>Total Tests</span> <span>--</span></div>
        <div className="rep-row"><span>Normal</span> <span className="text-green">--</span></div>
        <div className="rep-row"><span>Low</span> <span className="text-red">--</span></div>
        <div className="rep-row"><span>High</span> <span className="text-red">--</span></div>
        <div className="rep-row"><span>Borderline</span> <span className="text-orange">--</span></div>
        <button className="btn-outline-full">View Full Report</button>
      </div>

    </div>
  );
}

export default DashboardContent;
