import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEffect, useRef, useState } from 'react'

const navItems = [
  { label: 'Dashboard', path: '/admin', icon: '▦' },
  { label: 'Events', path: '/admin/events', icon: '🗓️' },
  { label: 'Venues', path: '/admin/venues', icon: '🏛️' },
  { label: 'Vendors', path: '/admin/vendors', icon: '🤝' },
  { label: 'Bookings', path: '/admin/bookings', icon: '🧾' },
  { label: 'Budgets', path: '/admin/budgets', icon: '💰' },
]

export default function AdminShell({
  title,
  subtitle = 'Dashboard / Admin',
  action,
  children,
}) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const [profileOpen, setProfileOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [msgOpen, setMsgOpen] = useState(false)
  const profileRef = useRef(null)
  const notifRef = useRef(null)
  const msgRef = useRef(null)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) setProfileOpen(false)
      if (notifRef.current && !notifRef.current.contains(event.target)) setNotifOpen(false)
      if (msgRef.current && !msgRef.current.contains(event.target)) setMsgOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="min-h-screen bg-[#ece7df] p-4 md:p-5">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-4 lg:grid-cols-[290px_1fr]">
        <aside className="rounded-[30px] bg-black px-5 py-6 text-white shadow-xl">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-xl">
              🌀
            </div>
            <div>
              <p className="text-3xl font-bold tracking-tight">EventZen</p>
              <p className="text-sm text-white/65">Admin workspace</p>
            </div>
          </div>

          <div className="mb-5 px-1 text-xs uppercase tracking-[0.25em] text-white/40">
            Menu
          </div>

          <nav className="space-y-3">
            {navItems.map((item) => {
              const active = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-4 text-base font-medium transition ${
                    active
                      ? 'bg-white text-black shadow'
                      : 'text-white/85 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="mt-8 border-t border-white/10 pt-6">
            <button
              onClick={handleLogout}
              className="w-full rounded-2xl border border-white/15 px-4 py-4 text-left text-base font-medium text-white/90 transition hover:bg-white/10 hover:text-white"
            >
              Logout
            </button>
          </div>
        </aside>

        <main className="space-y-4">
          <div className="rounded-[30px] bg-[#ddd6cd] px-5 py-4 shadow-sm">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-sm text-slate-500">{subtitle}</p>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                  {title}
                </h1>
              </div>

              <div className="flex flex-1 flex-col gap-3 xl:ml-8 xl:max-w-4xl xl:flex-row xl:items-center">
                <div className="flex flex-1 items-center gap-3 rounded-full bg-white px-5 py-4 shadow-sm">
                  <span className="text-lg text-slate-400">🔍</span>
                  <input
                    type="text"
                    placeholder="Search"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.target.value.trim()) {
                        const query = e.target.value.trim().toLowerCase()
                        const match = navItems.find((item) =>
                          item.label.toLowerCase().includes(query)
                        )
                        if (match) navigate(match.path)
                      }
                    }}
                  />
                </div>

                <div className="flex items-center justify-end gap-3">
                  {/* Messages */}
                  <div className="relative" ref={msgRef}>
                    <button
                      onClick={() => { setMsgOpen((prev) => !prev); setNotifOpen(false); setProfileOpen(false) }}
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-lg shadow-sm transition hover:bg-slate-50"
                    >
                      ✉️
                    </button>
                    {msgOpen && (
                      <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-72 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
                        <p className="mb-3 text-sm font-semibold text-slate-900">Messages</p>
                        <div className="space-y-3">
                          <div className="rounded-xl bg-[#f5f1eb] p-3">
                            <p className="text-sm font-medium text-slate-800">Test Customer</p>
                            <p className="text-xs text-slate-500">Booked 2 seats for Tech Summit</p>
                          </div>
                          <div className="rounded-xl bg-[#f5f1eb] p-3">
                            <p className="text-sm font-medium text-slate-800">System</p>
                            <p className="text-xs text-slate-500">All services running smoothly</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Notifications */}
                  <div className="relative" ref={notifRef}>
                    <button
                      onClick={() => { setNotifOpen((prev) => !prev); setMsgOpen(false); setProfileOpen(false) }}
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-lg shadow-sm transition hover:bg-slate-50"
                    >
                      🔔
                    </button>
                    {notifOpen && (
                      <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-72 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
                        <p className="mb-3 text-sm font-semibold text-slate-900">Notifications</p>
                        <div className="space-y-3">
                          <div className="rounded-xl bg-green-50 p-3">
                            <p className="text-sm font-medium text-green-800">New Booking</p>
                            <p className="text-xs text-green-600">A customer booked Tech Summit 2026</p>
                          </div>
                          <div className="rounded-xl bg-blue-50 p-3">
                            <p className="text-sm font-medium text-blue-800">Venue Added</p>
                            <p className="text-xs text-blue-600">Grand Convention Center is now available</p>
                          </div>
                          <div className="rounded-xl bg-orange-50 p-3">
                            <p className="text-sm font-medium text-orange-800">Budget Alert</p>
                            <p className="text-xs text-orange-600">Tech Summit venue budget 90% used</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Profile */}
                  <div className="relative" ref={profileRef}>
                    <button
                      onClick={() => { setProfileOpen((prev) => !prev); setNotifOpen(false); setMsgOpen(false) }}
                      className="flex items-center gap-3 rounded-full bg-white px-3 py-2 shadow-sm transition hover:bg-slate-50"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f4d86c] text-sm font-bold text-slate-900">
                        {user?.fullName?.slice(0, 1)?.toUpperCase() || 'A'}
                      </div>
                      <div className="hidden text-left sm:block">
                        <p className="text-sm font-semibold text-slate-900">
                          {user?.fullName || 'Admin User'}
                        </p>
                        <p className="text-xs text-slate-500">
                          {user?.email || 'admin@eventzen.com'}
                        </p>
                      </div>
                    </button>

                    {profileOpen && (
                      <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                        <button
                          onClick={() => { setProfileOpen(false); navigate('/') }}
                          className="w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-[#f5f1eb]"
                        >
                          Go to Home
                        </button>
                        <button
                          onClick={() => { setProfileOpen(false); navigate('/admin') }}
                          className="w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-[#f5f1eb]"
                        >
                          Admin Dashboard
                        </button>
                        <button
                          onClick={() => { setProfileOpen(false); handleLogout() }}
                          className="w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {action && <div className="flex justify-end">{action}</div>}

          {children}
        </main>
      </div>
    </div>
  )
}