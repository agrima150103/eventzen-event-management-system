import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'

import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import EventDetailPage from './pages/EventDetailPage'
import MyBookingsPage from './pages/MyBookingsPage'

import AdminDashboard from './pages/AdminDashboard'
import AdminEvents from './pages/AdminEvents'
import AdminVenues from './pages/AdminVenues'
import AdminVendors from './pages/AdminVendors'
import AdminBookings from './pages/AdminBookings'
import AdminBudgets from './pages/AdminBudgets'

function AppLayout() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <div className="min-h-screen bg-[#ece7df] text-slate-900">
      {!isAdminRoute && <Navbar />}

      <Routes>
        {/* Customer */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/events" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/events/:id" element={<EventDetailPage />} />
        <Route path="/my-bookings" element={<MyBookingsPage />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/events" element={<AdminEvents />} />
        <Route path="/admin/venues" element={<AdminVenues />} />
        <Route path="/admin/vendors" element={<AdminVendors />} />
        <Route path="/admin/bookings" element={<AdminBookings />} />
        <Route path="/admin/budgets" element={<AdminBudgets />} />
      </Routes>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </AuthProvider>
  )
}