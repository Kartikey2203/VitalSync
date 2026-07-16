import DashboardLayout from "./layout/layoutdb";
import Dashboard from "./pages/dashboard";
import Home from "./pages/Home.jsx";
import Login from "./pages/login";
import Records from "./pages/records";
import "./App.css";
import { Routes, Route } from "react-router-dom";
function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/dashboard" element={<DashboardLayout>
        <Dashboard />
      </DashboardLayout>
      } />
      <Route path="/records" element={<DashboardLayout>
        <Records />
      </DashboardLayout>
      } />
      <Route path="/" element={<Home/>} />
    </Routes>
  );
}

export default App;