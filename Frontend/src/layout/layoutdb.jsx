import Sidebar from "../components/sidebar";
import Topbar from "../components/header";

function DashboardLayout({ children }) {
  return (
    <div className="layout">
      <Sidebar />

      <div className="content">
        <Topbar />
        {children}
      </div>
    </div>
  );
}

export default DashboardLayout;