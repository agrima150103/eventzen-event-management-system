import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import EventDetailPage from './pages/EventDetailPage'
import MyBookingsPage from './pages/MyBookingsPage'
import AdminDashboard from './pages/AdminDashboard'
import AdminEvents from './pages/AdminEvents'
import AdminVenues from './pages/AdminVenues'
import AdminVendors from './pages/AdminVendors'
import AdminBookings from './pages/AdminBookings'
import AdminBudgets from './pages/AdminBudgets'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Customer Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
          <Route path="/my-bookings" element={<MyBookingsPage />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/events" element={<AdminEvents />} />
          <Route path="/admin/venues" element={<AdminVenues />} />
          <Route path="/admin/vendors" element={<AdminVendors />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
          <Route path="/admin/budgets" element={<AdminBudgets />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App