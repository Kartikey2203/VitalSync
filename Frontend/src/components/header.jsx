function header() {
  return (
    <div className="PulseIQ">
      <button className="navbar">Dashboard</button>

      <button className="navbar">Reports</button>

      <button className="navbar">Medications Record</button>
      <div className="actions">
        <input
          type="text"
          placeholder="Search..."
        />

        <button>🔔</button>
      </div>
    </div>
  );
}

export default header;