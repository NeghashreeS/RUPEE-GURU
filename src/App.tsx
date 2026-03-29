import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import HealthScore from "./pages/HealthScore";
import FirePlanner from "./pages/FirePlanner";
import Chat from "./pages/Chat";

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-50 font-sans text-gray-900">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/health-score" element={<HealthScore />} />
              <Route path="/fire-plan" element={<FirePlanner />} />
              <Route path="/chat" element={<Chat />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
