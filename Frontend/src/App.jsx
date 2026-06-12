import DashboardLayout from "./layout/layoutdb";
import Dashboard from "./pages/dashboard";
import "./App.css";

function App() {
  return (
    <DashboardLayout>
      <Dashboard />
    </DashboardLayout>
  );
}

export default App;