import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold tracking-wide">
        🎟️ EventZen
      </Link>

      {/* Navigation Links */}
      <div className="flex items-center gap-6">
        <Link to="/" className="hover:underline">Events</Link>

        {user ? (
          <>
            <Link to="/my-bookings" className="hover:underline">
              My Bookings
            </Link>
            <span className="text-sm text-blue-200">
              Hi, {user.fullName}
            </span>
            <button
              onClick={handleLogout}
              className="bg-white text-blue-600 px-4 py-1 rounded-full font-semibold hover:bg-blue-100 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link
              to="/register"
              className="bg-white text-blue-600 px-4 py-1 rounded-full font-semibold hover:bg-blue-100 transition"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}