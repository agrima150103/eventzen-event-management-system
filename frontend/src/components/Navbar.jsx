import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navLinkClass = (path) =>
    `rounded-full px-4 py-2 text-sm font-medium transition ${
      location.pathname === path
        ? 'bg-black text-white'
        : 'text-slate-700 hover:bg-white'
    }`

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-[#ece7df]/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-white">
            🎟️
          </div>
          <div>
            <p className="text-3xl font-bold tracking-tight text-slate-900">
              EventZen
            </p>
            <p className="text-xs text-slate-500">Event management system</p>
          </div>
        </Link>

        <nav className="flex items-center gap-3">
          <Link to="/events" className={navLinkClass('/events')}>
            Events
          </Link>

          {user?.role === 'CUSTOMER' && (
            <Link to="/my-bookings" className={navLinkClass('/my-bookings')}>
              My Bookings
            </Link>
          )}

          {user?.role === 'ADMIN' && (
            <Link
              to="/admin"
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                location.pathname.startsWith('/admin')
                  ? 'bg-black text-white'
                  : 'bg-white text-slate-900 hover:bg-slate-100'
              }`}
            >
              Admin Panel
            </Link>
          )}

          {user ? (
            <>
              <span className="hidden text-sm text-slate-600 md:inline">
                Hi, {user.fullName}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-100"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={navLinkClass('/login')}>
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-black px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}