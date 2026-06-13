import DashboardLayout from "./layout/layoutdb";
import Dashboard from "./pages/dashboard";
import Login from "./pages/login";
import "./App.css";
import { Routes, Route } from "react-router-dom";
function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<DashboardLayout>
        <Dashboard />
      </DashboardLayout>
      } />
      <Route path="/" element={<Login/>
      } />
    </Routes>
  );
}

export default App;