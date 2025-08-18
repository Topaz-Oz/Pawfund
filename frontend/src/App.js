import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context
import { AuthProvider } from './contexts/AuthContext';

// Layout components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Page components
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PetListPage from './pages/PetListPage';
import PetDetailPage from './pages/PetDetailPage';
import ProfilePage from './pages/ProfilePage';
import CartPage from './pages/CartPage';
import AdoptionPage from './pages/AdoptionPage';
import DonationPage from './pages/DonationPage';
import EventPage from './pages/EventPage';

// Admin pages
import DashboardPage from './pages/admin/DashboardPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import PetManagementPage from './pages/admin/PetManagementPage';
import EventManagementPage from './pages/admin/EventManagementPage';
import AdoptionManagementPage from './pages/admin/AdoptionManagementPage';

// Shelter pages
import ShelterDashboardPage from './pages/shelter/ShelterDashboardPage';
import ShelterUserManagementPage from './pages/shelter/ShelterUserManagementPage';
import AddPetPage from './pages/shelter/AddPetPage';
import ShelterPetManagementPage from './pages/shelter/PetManagementPage';
import ShelterEventsPage from './pages/shelter/ShelterEventsPage';
import ShelterEventCreatePage from './pages/shelter/ShelterEventCreatePage';
import ShelterAdoptionManagementPage from './pages/shelter/AdoptionManagementPage';
import VolunteerEventsPage from './pages/volunteer/VolunteerEventsPage';

// Route components
import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoute';
import RoleRoute from './routes/RoleRoute';

// Error pages
import UnauthorizedPage from './pages/UnauthorizedPage';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/pets" element={<PetListPage />} />
              <Route path="/pets/:id" element={<PetDetailPage />} />
              <Route path="/events" element={<EventPage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              
              {/* Auth Routes */}
              <Route path="/login" element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              } />
              <Route path="/register" element={
                <PublicRoute>
                  <RegisterPage />
                </PublicRoute>
              } />
              
              {/* User Routes */}
              <Route path="/profile" element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              } />
              <Route path="/cart" element={
                <PrivateRoute>
                  <CartPage />
                </PrivateRoute>
              } />
              <Route path="/adoptions" element={
                <PrivateRoute>
                  <AdoptionPage />
                </PrivateRoute>
              } />
              <Route path="/donations" element={
                <PrivateRoute>
                  <DonationPage />
                </PrivateRoute>
              } />
              
              {/* Admin Routes */}
              <Route path="/admin" element={
                <RoleRoute allowedRoles={['ADMIN']}>
                  <DashboardPage />
                </RoleRoute>
              } />
              <Route path="/admin/users" element={
                <RoleRoute allowedRoles={['ADMIN']} requiredPermissions={['manage_users']}>
                  <UserManagementPage />
                </RoleRoute>
              } />
              <Route path="/admin/pets" element={
                <RoleRoute allowedRoles={['ADMIN']} requiredPermissions={['manage_pets']}>
                  <PetManagementPage />
                </RoleRoute>
              } />
              <Route path="/admin/events" element={
                <RoleRoute allowedRoles={['ADMIN']} requiredPermissions={['manage_events']}>
                  <EventManagementPage />
                </RoleRoute>
              } />
              <Route path="/admin/adoptions" element={
                <RoleRoute allowedRoles={['ADMIN']} requiredPermissions={['manage_adoptions']}>
                  <AdoptionManagementPage />
                </RoleRoute>
              } />
              <Route path="/admin/settings" element={
                <RoleRoute allowedRoles={['ADMIN']} requiredPermissions={['manage_content']}>
                  <div className="py-8">
                    <div className="max-w-7xl mx-auto px-4">
                      <h1 className="text-3xl font-bold text-secondary-800 mb-4">Cài đặt hệ thống</h1>
                      <p className="text-secondary-600">Trang cài đặt hệ thống (đang phát triển)</p>
                    </div>
                  </div>
                </RoleRoute>
              } />
              
              {/* Shelter Routes */}
              <Route path="/shelter" element={
                <RoleRoute allowedRoles={['SHELTER']}>
                  <ShelterDashboardPage />
                </RoleRoute>
              } />
              <Route path="/shelter/users" element={
                <RoleRoute allowedRoles={['SHELTER']} requiredPermissions={['manage_users']}>
                  <ShelterUserManagementPage />
                </RoleRoute>
              } />
              <Route path="/shelter/pets" element={
                <RoleRoute allowedRoles={['SHELTER']} requiredPermissions={['manage_pets']}>
                  <ShelterPetManagementPage />
                </RoleRoute>
              } />
              <Route path="/shelter/pets/add" element={
                <RoleRoute allowedRoles={['SHELTER']} requiredPermissions={['manage_pets']}>
                  <AddPetPage />
                </RoleRoute>
              } />
              <Route path="/shelter/adoptions" element={
                <RoleRoute allowedRoles={['SHELTER']} requiredPermissions={['manage_adoptions']}>
                  <ShelterAdoptionManagementPage />
                </RoleRoute>
              } />
              <Route path="/shelter/events" element={
                <RoleRoute allowedRoles={['SHELTER']}>
                  <ShelterEventsPage />
                </RoleRoute>
              } />
              <Route path="/shelter/events/create" element={
                <RoleRoute allowedRoles={['SHELTER']}>
                  <ShelterEventCreatePage />
                </RoleRoute>
              } />
              <Route path="/volunteer/events" element={
                <RoleRoute allowedRoles={['VOLUNTEER']}>
                  <VolunteerEventsPage />
                </RoleRoute>
              } />
              <Route path="/shelter/reports" element={
                <RoleRoute allowedRoles={['SHELTER']} requiredPermissions={['view_analytics']}>
                  <div className="py-8">
                    <div className="max-w-7xl mx-auto px-4">
                      <h1 className="text-3xl font-bold text-secondary-800 mb-4">Báo cáo</h1>
                      <p className="text-secondary-600">Trang báo cáo hoạt động (đang phát triển)</p>
                    </div>
                  </div>
                </RoleRoute>
              } />
            </Routes>
          </main>
          <Footer />
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
