import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Occupants from './pages/Occupants';
import Houses from './pages/Houses';
import Payments from './pages/Payments';
import Dashboard from "./pages/Dashbord"; // Sesuaikan dengan nama file aslimu

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-gray-100 flex">
        
        {/* Minimalist Sidebar */}
        <aside className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col p-6 shadow-xl relative z-10">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              RT Admin Panel
            </h2>
          </div>
          
          <nav className="flex flex-col space-y-2">
            <Link to="/" className="px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-900 hover:text-blue-300 transition-all font-medium">
              📊 Dashboard Laporan
            </Link>
            <Link to="/occupants" className="px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-900 hover:text-blue-300 transition-all font-medium">
              👥 Manajemen Penghuni
            </Link>
            <Link to="/houses" className="px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-900 hover:text-blue-300 transition-all font-medium">
              🏠 Manajemen Rumah
            </Link>
            <Link to="/payments" className="px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-900 hover:text-blue-300 transition-all font-medium">
              💳 Keuangan & Iuran
            </Link>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 bg-gray-900 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/occupants" element={<Occupants />} />
            <Route path="/houses" element={<Houses />} /> 
            <Route path="/payments" element={<Payments />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;