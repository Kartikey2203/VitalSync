import Sidebar from "../components/sidebar";
import Topbar from "../components/header";

function DashboardLayout({ children }) {
  return (
    <div className="layout">
      {/* <Sidebar /> */}
      <div className="content" style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        {/* <Topbar /> */}
        <div className="dashboard-scrollable" style={{ flex: 1, overflowY: 'auto' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;