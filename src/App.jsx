import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Layout from './pages/AccessFoeEach/Layout';
import Overview from './pages/AccessFoeEach/Overview';
import Financial from './pages/AccessFoeEach/Financial';
import Accounting from './pages/AccessFoeEach/Accounting';
import Engineering from './pages/AccessFoeEach/Engineering';
import Commercial from './pages/AccessFoeEach/Commercial';
import HRDashboard from './pages/HR/Dashboard';
import ManagerDashboard from './pages/Manager/Dashboard';
import SectorDashboard from './pages/AccessFoeEach/Dashboard';
import AdminDashboard from './pages/Admin/Dashboard';
import UserManagement from './pages/Admin/UserManagement';
import SystemAnalytics from './pages/Admin/SystemAnalytics';
import RoleManagement from './pages/Admin/RoleManagement';
import SystemSettings from './pages/Admin/SystemSettings';
import DatabaseAdmin from './pages/Admin/DatabaseAdmin';
import FinancialDashboard from './pages/Financial/Dashboard';
import EngineeringDashboard from './pages/Engineering/Dashboard';
import CommercialDashboard from './pages/Commercial/Dashboard';
import PurchasingDashboard from './pages/Purchasing/Dashboard';
import PurchasingOverview from './pages/Purchasing/Overview';
import PurchasingInventory from './pages/Purchasing/InventoryManagement';
import PurchasingSuppliers from './pages/Purchasing/SupplierRelations';
import PurchasingOrders from './pages/Purchasing/PurchaseOrders';

function RequireAuth({ children, role }) {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  
  if (role && user.role.toLowerCase() !== role) {
    // Redirect to the user's own dashboard
    return <Navigate to={`/${user.role.toLowerCase()}`} replace />;
  }
  
  return children;
}

function LocationLogger() {
  const location = useLocation();
  console.log('App rendered. Current pathname:', location.pathname);
  return null;
}

const App = () => {
  return (
    <Router>
      <LocationLogger />
      <Routes>
        {/* Login page - shows first */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Admin Routes */}
        <Route path="/admin/*" element={<RequireAuth role="admin"><AdminDashboard /></RequireAuth>}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<Overview />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="analytics" element={<SystemAnalytics />} />
          <Route path="roles" element={<RoleManagement />} />
          <Route path="database" element={<DatabaseAdmin />} />
          <Route path="settings" element={<SystemSettings />} />
          <Route path="financial" element={<Financial />} />
          <Route path="accounting" element={<Accounting />} />
          <Route path="engineering" element={<Engineering />} />
          <Route path="commercial" element={<Commercial />} />
          <Route path="sector" element={<SectorDashboard />} />
        </Route>
        
        {/* Manager Routes */}
        <Route path="/manager/*" element={<RequireAuth role="manager"><ManagerDashboard /></RequireAuth>}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<Overview />} />
          <Route path="financial" element={<Financial />} />
          <Route path="accounting" element={<Accounting />} />
          <Route path="engineering" element={<Engineering />} />
          <Route path="commercial" element={<Commercial />} />
          <Route path="hr" element={<div className="p-8 bg-gray-50 min-h-screen"><h1 className="text-2xl font-bold">HR Dashboard - Coming Soon</h1></div>} />
          <Route path="team" element={<div className="p-8 bg-gray-50 min-h-screen"><h1 className="text-2xl font-bold">Team Management - Coming Soon</h1></div>} />
        </Route>
        
        {/* HR Routes */}
        <Route path="/hr/*" element={<RequireAuth role="hr"><HRDashboard /></RequireAuth>}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<div className="p-8 bg-gray-50 min-h-screen"><h1 className="text-2xl font-bold">HR Overview - Coming Soon</h1></div>} />
          <Route path="employees" element={<div className="p-8 bg-gray-50 min-h-screen"><h1 className="text-2xl font-bold">Employee Management - Coming Soon</h1></div>} />
          <Route path="metrics" element={<div className="p-8 bg-gray-50 min-h-screen"><h1 className="text-2xl font-bold">HR Metrics - Coming Soon</h1></div>} />
          <Route path="schedule" element={<div className="p-8 bg-gray-50 min-h-screen"><h1 className="text-2xl font-bold">Schedule Management - Coming Soon</h1></div>} />
        </Route>
        
        {/* Financial Routes */}
        <Route path="/financial/*" element={<RequireAuth role="financial"><FinancialDashboard /></RequireAuth>}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<Financial />} />
          <Route path="revenue" element={<div className="p-8 bg-gray-50 min-h-screen"><h1 className="text-2xl font-bold">Revenue Analysis - Coming Soon</h1></div>} />
          <Route path="budget" element={<div className="p-8 bg-gray-50 min-h-screen"><h1 className="text-2xl font-bold">Budget Planning - Coming Soon</h1></div>} />
          <Route path="invoices" element={<div className="p-8 bg-gray-50 min-h-screen"><h1 className="text-2xl font-bold">Invoice Management - Coming Soon</h1></div>} />
        </Route>
        
        {/* Engineering Routes */}
        <Route path="/engineering/*" element={<RequireAuth role="engineering"><EngineeringDashboard /></RequireAuth>}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<Engineering />} />
          <Route path="projects" element={<div className="p-8 bg-gray-50 min-h-screen"><h1 className="text-2xl font-bold">Project Management - Coming Soon</h1></div>} />
          <Route path="metrics" element={<div className="p-8 bg-gray-50 min-h-screen"><h1 className="text-2xl font-bold">Performance Metrics - Coming Soon</h1></div>} />
          <Route path="equipment" element={<div className="p-8 bg-gray-50 min-h-screen"><h1 className="text-2xl font-bold">Equipment Status - Coming Soon</h1></div>} />
        </Route>
        
        {/* Commercial Routes */}
        <Route path="/commercial/*" element={<RequireAuth role="commercial"><CommercialDashboard /></RequireAuth>}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<Commercial />} />
          <Route path="sales" element={<div className="p-8 bg-gray-50 min-h-screen"><h1 className="text-2xl font-bold">Sales Analytics - Coming Soon</h1></div>} />
          <Route path="clients" element={<div className="p-8 bg-gray-50 min-h-screen"><h1 className="text-2xl font-bold">Client Management - Coming Soon</h1></div>} />
          <Route path="deals" element={<div className="p-8 bg-gray-50 min-h-screen"><h1 className="text-2xl font-bold">Partnership Deals - Coming Soon</h1></div>} />
        </Route>
        
        {/* Purchasing Routes */}
        <Route path="/purchasing/*" element={
          <RequireAuth role="purchasing">
            <PurchasingDashboard />
          </RequireAuth>
        }>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<PurchasingOverview />} />
          <Route path="inventory" element={<PurchasingInventory />} />
          <Route path="suppliers" element={<PurchasingSuppliers />} />
          <Route path="orders" element={<PurchasingOrders />} />
        </Route>
        
        {/* Redirect any unknown route to login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
