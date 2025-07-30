import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Lazy load all components
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Layout = lazy(() => import('./pages/AccessFoeEach/Layout'));
const Overview = lazy(() => import('./pages/AccessFoeEach/Overview'));
const Financial = lazy(() => import('./pages/AccessFoeEach/Financial'));
const Accounting = lazy(() => import('./pages/AccessFoeEach/Accounting'));
const Engineering = lazy(() => import('./pages/AccessFoeEach/Engineering'));
const Commercial = lazy(() => import('./pages/AccessFoeEach/Commercial'));
const HRDashboard = lazy(() => import('./pages/HR/Dashboard'));
const ManagerDashboard = lazy(() => import('./pages/Manager/Dashboard'));
const SectorDashboard = lazy(() => import('./pages/AccessFoeEach/Dashboard'));
const AdminDashboard = lazy(() => import('./pages/Admin/Dashboard'));
const UserManagement = lazy(() => import('./pages/Admin/UserManagement'));
const SystemAnalytics = lazy(() => import('./pages/Admin/SystemAnalytics'));
const RoleManagement = lazy(() => import('./pages/Admin/RoleManagement'));
const SystemSettings = lazy(() => import('./pages/Admin/SystemSettings'));
const DatabaseAdmin = lazy(() => import('./pages/Admin/DatabaseAdmin'));
const FinancialDashboard = lazy(() => import('./pages/Financial/Dashboard'));
const EngineeringDashboard = lazy(() => import('./pages/Engineering/Dashboard'));
const CommercialDashboard = lazy(() => import('./pages/Commercial/Dashboard'));
const PurchasingDashboard = lazy(() => import('./pages/Purchasing/Dashboard'));
const PurchasingOverview = lazy(() => import('./pages/Purchasing/Overview'));
const PurchasingInventory = lazy(() => import('./pages/Purchasing/InventoryManagement'));
const PurchasingSuppliers = lazy(() => import('./pages/Purchasing/SupplierRelations'));
const PurchasingOrders = lazy(() => import('./pages/Purchasing/PurchaseOrders'));

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
  </div>
);

function RequireAuth({ children, role }) {
  const location = useLocation();
  
  try {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    
    if (!user) {
      return <Navigate to="/" state={{ from: location }} replace />;
    }
    
    if (role && user.role && user.role.toLowerCase() !== role) {
      return <Navigate to={`/${user.role.toLowerCase()}`} replace />;
    }
    
    return children;
  } catch (error) {
    console.error('Error in RequireAuth:', error);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    return <Navigate to="/" replace />;
  }
}

function LocationLogger() {
  const location = useLocation();
  
  React.useEffect(() => {
    console.log('App rendered. Current pathname:', location.pathname);
  }, [location.pathname]);
  
  return null;
}

const App = () => {
  return (
    <Router>
      <LocationLogger />
      <Suspense fallback={<LoadingSpinner />}>
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
      </Suspense>
    </Router>
  );
};

export default App;
